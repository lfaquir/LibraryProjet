using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;



public class AuthorController : Controller
{
    public readonly AppDbContext _context;

    public AuthorController(AppDbContext context){
        _context = context;
    }
    public IActionResult Index()
    {
        Console.WriteLine(" => AuthorController.Index reached!");
        var authors = _context.authors.ToList();
        return View(authors);
    }

    public IActionResult Details(int id){
        var author = _context.authors.FirstOrDefault(a => a.Id == id);
        
        if (author == null) return NotFound();
        return View(author);
        
    }

    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Create(Author author)
    { 
        if(ModelState.IsValid){
            var authors = _context.authors.FirstOrDefault(a => a.AuthorName.ToLower() == author.AuthorName.ToLower());
            if(authors != null){
                ModelState.AddModelError("AuthorName","this author has been already added");
            }else{
                _context.Add(author);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
        }
            return View();
    }

    [HttpGet]
    public ActionResult Edit(int id){
        var author = _context.authors.FirstOrDefault(a=> a.Id == id);
        if(author == null) return NotFound();
        return View(author);
    }

    [HttpPost]
    public IActionResult Edit(int id, Author author){
        var authorToUpdate = _context.authors.Find(id);
        if (authorToUpdate == null)
            return NotFound();

        authorToUpdate.AuthorName = author.AuthorName;
        _context.SaveChanges();
        return RedirectToAction("Index");
    }

    [HttpGet]
    public IActionResult Delete(int id){
        var author = _context.authors.Find(id);
        if(author == null) return NotFound();
        return View(author);
    }

    [HttpPost]
    public IActionResult Delete(int id, Author author){
        try{
            _context.authors.Remove(author);
            _context.SaveChanges();
            return RedirectToAction(nameof(Index));
        }catch{
            return View();
        }
    }
}
