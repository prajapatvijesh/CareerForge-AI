import { JobApplication, IJobApplication } from './job.model';
import { CreateJobInput, UpdateJobInput, GetJobsQuery } from './job.schema';
import mongoose from 'mongoose';

export class JobRepository {
  public async create(userId: string, data: CreateJobInput): Promise<IJobApplication> {
    const job = new JobApplication({
      userId: new mongoose.Types.ObjectId(userId),
      ...data,
      resumeId: data.resumeId ? new mongoose.Types.ObjectId(data.resumeId) : undefined,
    });
    return job.save();
  }

  public async findById(id: string, userId: string): Promise<IJobApplication | null> {
    return JobApplication.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false
    });
  }

  public async update(id: string, userId: string, data: UpdateJobInput): Promise<IJobApplication | null> {
    const updateData: any = { ...data };
    if (data.resumeId) {
      updateData.resumeId = new mongoose.Types.ObjectId(data.resumeId);
    }
    
    return JobApplication.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  public async softDelete(id: string, userId: string): Promise<IJobApplication | null> {
    return JobApplication.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false
      },
      { $set: { isDeleted: true } },
      { new: true }
    );
  }

  public async findManyWithPagination(userId: string, query: GetJobsQuery) {
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    };

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.search) {
      filter.$or = [
        { companyName: { $regex: query.search, $options: 'i' } },
        { jobTitle: { $regex: query.search, $options: 'i' } }
      ];
    }

    const sortDir = query.sortOrder === 'desc' ? -1 : 1;
    const sort: any = { [query.sortBy]: sortDir };

    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      JobApplication.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.limit)
        .lean(),
      JobApplication.countDocuments(filter)
    ]);

    return {
      items,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit)
      }
    };
  }

  /**
   * Generates lightweight statistics grouped by job status
   * Designed for fast dashboard loading
   */
  public async getStats(userId: string) {
    const stats = await JobApplication.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          isDeleted: false 
        } 
      },
      { 
        $group: { 
          _id: '$status', 
          count: { $sum: 1 } 
        } 
      }
    ]);

    // Format into a map of status -> count
    const formattedStats = stats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    return formattedStats;
  }
}
