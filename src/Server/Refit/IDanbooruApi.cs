using System;
using System.Net.Http;
using System.Threading.Tasks;
using Refit;

namespace BooruViewer.Refit
{
    public interface IDanbooruApi
    {
        [Get("/posts.json")]
        Task<Models.Danbooru.Post[]> GetPostsAsync(String tags, Int64 page, Int64 limit, [Header("Authorization")] String authorization = null);
        [Get("/tags/autocomplete.json")]
        Task<Models.Danbooru.AutoComplete[]> GetAutocompleteAsync([AliasAs("search[name_matches]")] String tags, Int64 limit = 10, [Header("Authorization")] String authorization = null);
        [Post("/favorites.json")]
        Task<Models.Danbooru.Post> AddFavorite([AliasAs("post_id")] UInt64 postId, [Header("Authorization")] String authorization = null); // returns post when not already favorited, otherwise errors.
        [Delete("/favorites/{postId}.json")]
        Task RemoveFavorite(UInt64 postId, [Header("Authorization")] String authorization = null); // Expects 204 no content, returns 204 when id isn't favorited.
        [Get("/{**path}")]
        Task<HttpContent> GetImageAsync(String path);
    }
}
