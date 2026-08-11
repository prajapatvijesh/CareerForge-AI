import { JobRepository } from './job.repository';
import { CreateJobInput, UpdateJobInput, GetJobsQuery } from './job.schema';
import { AppError } from '../../utils/AppError';

export class JobService {
  private repository = new JobRepository();

  public async getJobs(userId: string, query: GetJobsQuery) {
    return this.repository.findManyWithPagination(userId, query);
  }

  public async getJobById(id: string, userId: string) {
    const job = await this.repository.findById(id, userId);
    // Explicit ownership/existence check prevents unauthorized access
    if (!job) {
      throw new AppError('Job application not found', 404);
    }
    return job;
  }

  public async createJob(userId: string, data: CreateJobInput) {
    return this.repository.create(userId, data);
  }

  public async updateJob(id: string, userId: string, data: UpdateJobInput) {
    const job = await this.repository.update(id, userId, data);
    if (!job) {
      throw new AppError('Job application not found', 404);
    }
    return job;
  }

  public async deleteJob(id: string, userId: string) {
    const job = await this.repository.softDelete(id, userId);
    if (!job) {
      throw new AppError('Job application not found', 404);
    }
    return job;
  }

  public async getStats(userId: string) {
    return this.repository.getStats(userId);
  }
}
