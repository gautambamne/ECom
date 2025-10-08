interface ICategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parent_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ICreateCategoryRequest {
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
}

interface IUpdateCategoryRequest extends Partial<ICreateCategoryRequest> {}

interface IGetCategoriesResponse {
  categories: ICategory[];
}

interface IGetCategoryResponse {
  category: ICategory;
}

interface ICreateCategoryResponse {
  category: ICategory;
  message: string;
}

interface IUpdateCategoryResponse {
  category: ICategory;
  message: string;
}