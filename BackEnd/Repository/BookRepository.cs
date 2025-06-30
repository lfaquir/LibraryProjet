using WebApplication1.Data;
using WebApplication1.Models;

public class BookRepository : IRepository<Book>
{
    private readonly AppDbContext _context;

    public BookRepository(AppDbContext context){
        _context = context;
    }
    public void Add(Book item)
    {
        _context.Add(item);
        _context.SaveChanges();
    }

    public void Delete(int id)
    {
        var book = _context.books.Find(id);
        if(book != null){
            _context.Remove(book);
            _context.SaveChanges();
        }else{
            Console.WriteLine($"Aucun livre triuver avec l'ID {id}");
        }
    }

    public void Edit(int id, Book book)
    {
        var bookOld = _context.books.SingleOrDefault(a => a.Id == id);
        if(bookOld != null){
            bookOld.Author = book.Author;
            _context.SaveChanges();
        }
        else{
            Console.WriteLine($"Aucun book trouver avec l'ID {id}");
        }
    }

    public IList<Book> GetAll()
    {
        return _context.books.ToList();
    }

    public Book GetById(int id)
    {
        var book = _context.books.Single(a => a.Id == id);
        return book;
    }
}