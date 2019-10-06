using AutoMapper;
using BooruViewer.Models.Response;
using BooruViewer.Refit;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;

namespace BooruViewer.Controllers.Api.Danbooru
{
    [Route("/api/danbooru/safe")]
    public class SfwDanbooruController : AbstractDanbooruController
    {
        protected override SourceBooru SourceBooru { get; }

        public SfwDanbooruController(ISafeDanbooruApi api, IMapper mapper, IDataProtectionProvider dataProtectorProvider) : base(api, mapper, dataProtectorProvider)
        {
            this.SourceBooru = new SourceBooru("safe-danbooru", "Danbooru (Safe)", "https://safebooru.donmai.us/");
        }
    }
}
