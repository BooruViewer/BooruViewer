using System;
using System.Threading.Tasks;
using Refit;

namespace BooruViewer.Refit
{
    public interface ISafeDanbooruApi : IDanbooruApi
    {
        [Get("/posts.json")]
        new Task<Models.Danbooru.Post[]> GetPostsAsync(String tags, Int64 page, Int64 limit, [Header("Authorization")] String authorization = null);
    }
}
