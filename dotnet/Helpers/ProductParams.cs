namespace dotnet.Helpers
{
    public class ProductParams
    {
        private const int maxPageSize = 50;
        public int pageNumber { get; set; } = 1;
        public string filters { get; set; } = "";
        public string orderBy { get; set; }        
        public string direction { get; set; } = "";
        public int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > maxPageSize) ? maxPageSize : value; }
        }
        
    }
}