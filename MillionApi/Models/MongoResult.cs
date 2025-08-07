namespace MillionApi.Models
{
    /// <summary>
    /// Resultado tipado para operaciones de MongoDB
    /// </summary>
    public class MongoResult<T>
    {
        public T Data { get; set; }
        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public int? TotalRecords { get; set; }

        public MongoResult()
        {
            IsSuccess = false;
            Message = string.Empty;
        }

        public static MongoResult<T> Failure(Exception ex)
        {
            return new MongoResult<T>
            {
                IsSuccess = false,
                Message = ex.Message
            };
        }
        }
}