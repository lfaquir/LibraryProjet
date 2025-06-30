using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

public class AuthorRepository : IRepository<Author>
{
    private readonly AppDbContext _context;

    public AuthorRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(Author item)
    {
            _context.authors.Add(item);
            _context.SaveChanges();
    }
    public void Delete(int id)
    {
        var author = _context.authors.SingleOrDefault(a => a.Id == id);
        if (author != null){
            _context.authors.Remove(author);
            _context.SaveChanges();
        } 
        else{
            Console.WriteLine($"Auncun auteur trouver avec l'ID{id}");
        }
    }

    public void Edit(int id, Author author)
    {
        var authorOld = _context.authors.SingleOrDefault(a => a.Id == id);
        if(authorOld != null){
            authorOld.AuthorName = author.AuthorName;
        }
        else{
            Console.WriteLine($"Aucun auteur trouver avec l'ID {id}");
        }
    }

    public IList<Author> GetAll()
    {
        return _context.authors.ToList();
    }

    public Author GetById(int id)
    {
        var author = _context.authors.Find(id);

        if (author == null){
            throw new Exception("No author");
        }
        return author;
    }

}