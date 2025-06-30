using WebApplication1.Data;
using WebApplication1.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

public class UserRepository : IRepository<User>
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(User item)
    {
            _context.users.Add(item);
            _context.SaveChanges();
    }
    public void Delete(int id)
    {
        var User = _context.users.SingleOrDefault(a => a.Id == id);
        if (User != null){
            _context.users.Remove(User);
            _context.SaveChanges();
        } 
        else{
            Console.WriteLine($"Auncun auteur trouver avec l'ID{id}");
        }
    }

    public void Edit(int id, User User)
    {
        var UserOld = _context.users.SingleOrDefault(a => a.Id == id);
        if(UserOld != null){
            UserOld.UserName = User.UserName;
        }
        else{
            Console.WriteLine($"Aucun auteur trouver avec l'ID {id}");
        }
    }

    public IList<User> GetAll()
    {
        return _context.users.ToList();
    }

    public User GetById(int id)
    {
        var User = _context.users.Find(id);

        if (User == null){
            throw new Exception("No User");
        }
        return User;
    }

}