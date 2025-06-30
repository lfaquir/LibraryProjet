using System.Linq.Expressions;
using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;


public class BookController : Controller{

    private readonly AppDbContext _context;

    public BookController(AppDbContext context) {
        _context = context;
    }

    public IActionResult Index(){
        var book = _context.books.Include(a =>a.Author).ToList();
        return View(book);
    }

    public IActionResult Details(int id){
        var book = _context.books.Include(a=>a.Author).FirstOrDefault(a => a.Id == id);
        if(book == null) return NotFound();
        return View(book);
    }

    [HttpGet]
    public IActionResult Create(){

        // Utiliser AuthorRepository pour obtenir la liste des auteurs
        ViewBag.AuthorList = new SelectList(_context.authors.ToList(), "Id", "AuthorName");
        return View();
    }

    [HttpPost]
    public IActionResult Create(Book book){
        
            if(ModelState.IsValid){
                var books = _context.books.FirstOrDefault(a=>a.Title.ToLower() == book.Title.ToLower()
                                                             &&a.Description.ToLower() == book.Description.ToLower()
                                                             /*&&a.Author.AuthorName.ToLower()==book.Author?.AuthorName.ToLower()*/);
                if(books != null){
                    ModelState.AddModelError("Title, Description, AuthorName, ","this book has been already added");
                }else{
                    book.Author = book.Author;
                    _context.Attach(book); // Mise à jour dans le dépôt
                    Console.WriteLine(book);
                    Console.WriteLine(book.Author);
                    _context.SaveChanges();
                    return RedirectToAction("Index");
                }
            }
            //Recharge la liste des auteurs ici si l'enregistrement échoue
            ViewBag.AuthorList = _context.authors.Select(a => new SelectListItem
            {
                Value = a.Id.ToString(),
                Text = a.AuthorName
            }).ToList();   
            return View();
    }

    [HttpGet]
    public IActionResult Edit(int id){

        // Récupérer le livre par ID
        var book = _context.books.Find(id);  
        // obtenir la liste des auteurs
        ViewBag.AuthorList = new SelectList(_context.authors.ToList(), "Id", "AuthorName");
        return View(book);

    }

    [HttpPost]
    public IActionResult Edit(int id, Book book){
        
        var bookToUpdate = _context.books.Find(id);
        if (bookToUpdate == null)
            return NotFound();

        bookToUpdate.Title = book.Title;
        bookToUpdate.Description = book.Description;
        bookToUpdate.AuthorId=book.AuthorId;
        _context.SaveChanges();
        return RedirectToAction("Index");
    }

    [HttpGet]
    public IActionResult Delete(int id){
        var book = _context.books.Include(a=>a.Author).FirstOrDefault(a=>a.Id==id);
        if(book == null) return NotFound();
        return View(book);
    }

    [HttpPost]
    public IActionResult Delete(int id, Book book){
        try{
            _context.Remove(book);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }catch{
            return View();
        }
    }

}