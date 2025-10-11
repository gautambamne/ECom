interface ICategory {
  id: string;
  name: string;
  _count: {
    products: number;
  };
}

interface ICreateCategoryResponse {
  category: ICategory;
  message: string;
}

interface IUpdateCategoryResponse {
  category: ICategory;
  message: string;
}

interface IGetCategoriesResponse {
  categories: ICategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface IGetCategoryResponse {
  category: ICategory;
}

interface ICreateCategoryResponse {
  category: ICategory;
  message: string;
}
