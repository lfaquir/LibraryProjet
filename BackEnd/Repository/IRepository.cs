using WebApplication1.Models;

public interface IRepository<T>
{
    IList<T> GetAll();
    T GetById(int id);
    void Add (T item);
    void Edit (int id, T Item);
    void Delete (int id);
    //void Edit(Author author);
}