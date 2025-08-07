using MillionApi.Models;

namespace MillionApi.Interfaces
{
    public interface IObject
    {
        Task<IEnumerable<Object_Model>> GetAsync();
    }
}
