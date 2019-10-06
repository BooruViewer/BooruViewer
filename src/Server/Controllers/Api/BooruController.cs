using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace BooruViewer.Controllers.Api
{
    public abstract class BooruController : Controller
    {
        public abstract Task<JsonResult> PostsAsync(String tags, Int64 page, Int64 limit);
        public abstract Task<JsonResult> AutocompleteAsync(String tag);

        public abstract Task<JsonResult> Authenticate(String username, String password);

        public abstract Task<FileResult> ImageAsync(String parts);
    }
}
