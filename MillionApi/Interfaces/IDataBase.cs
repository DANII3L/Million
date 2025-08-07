using System.Threading.Tasks;
using MillionApi.Models;

namespace MillionApi.Interfaces
{
    public interface IDataBase
    {
        Task<MongoResult<IEnumerable<TResult>>> EjecutarConsultaAsync<TResult>(MongoParameters parameters) where TResult : new();
    }
}