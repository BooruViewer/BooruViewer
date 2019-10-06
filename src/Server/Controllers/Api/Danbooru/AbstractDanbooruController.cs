using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BooruViewer.Models;
using BooruViewer.Models.Danbooru;
using BooruViewer.Models.Response;
using BooruViewer.Refit;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Refit;

namespace BooruViewer.Controllers.Api.Danbooru
{
    public abstract class AbstractDanbooruController : BooruController
    {
        private readonly IDanbooruApi _api;

        protected readonly IDataProtector DataProtector;
        protected abstract SourceBooru SourceBooru { get; }

        protected AbstractDanbooruController(IDanbooruApi api, IDataProtectionProvider dataProtectorProvider)
        {
            this._api = api;
            this.DataProtector = dataProtectorProvider.CreateProtector("danbooru-api-details");
        }

        [HttpGet("posts")]
        public override async Task<JsonResult> PostsAsync(String tags, Int64 page, Int64 limit)
        {
            if (page < 1)
                return this.Json(new ResponseDto<ResponseErrorMessage>(false,
                    new ResponseErrorMessage("Page cannot be 0 or negative.")));
            if (limit < 1)
                return this.Json(new ResponseDto<ResponseErrorMessage>(false,
                    new ResponseErrorMessage("Limit cannot be 0 or negative.")));

            ICollection<Post> posts;
            try
            {
                posts = await this._api.GetPostsAsync(tags, page, limit, null);
            }
            catch (ApiException crap)
            {
                if (!crap.HasContent)
                    throw;

                var error = await crap.GetContentAsAsync<Request>();

                return this.Json(new ResponseDto<ResponseErrorMessage>(false,
                    new ResponseErrorMessage(
                        $"Proxy request to danbooru failed.{Environment.NewLine}" +
                        $"Reason: {error.Message}{Environment.NewLine}" +
                        $"Stacktrace: {String.Join(Environment.NewLine, error.Backtrace)}")));
            }

            // TODO: Order tags!

            var response = new ResponseDto<PostsResponseDto>(true, new PostsResponseDto(this.SourceBooru, null /* TODO: Map source to dto */));
            return this.Json(response);
        }
    }
}
