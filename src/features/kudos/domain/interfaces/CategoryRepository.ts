export interface Category {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
}

export interface CategoryRepository {
  findById(id: string, organizationId: string): Promise<Category | null>;
  findAll(organizationId: string): Promise<Category[]>;
}
