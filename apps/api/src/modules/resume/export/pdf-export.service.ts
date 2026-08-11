import puppeteer from 'puppeteer';
import { IExportStrategy } from './export.strategy';
import { IResume } from '../resume.model';
import { AppError } from '../../../utils/AppError';

export class PdfExportService implements IExportStrategy {
  public async export(resume: IResume, htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // We set the content of the page to the provided HTML.
      // The frontend preview will send the compiled HTML strings, 
      // or we can load a specific route on the frontend and call .pdf()
      await page.setContent(htmlContent, { waitUntil: 'load' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      });

      return Buffer.from(pdfBuffer);
    } catch (error) {
      console.error('Puppeteer PDF export failed:', error);
      throw new AppError('Failed to generate PDF. Please try again later.', 500);
    } finally {
      await browser.close();
    }
  }
}
