import { Company } from './company.entity';

export interface ICompanyRepository {
  save(company: Company): Promise<Company>;
  findById(id: string): Promise<Company | null>;
}







