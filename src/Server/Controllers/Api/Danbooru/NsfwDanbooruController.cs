using System;
using System.Text;
using AutoMapper;
using BooruViewer.Models.Response;
using BooruViewer.Refit;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;

namespace BooruViewer.Controllers.Api.Danbooru
{
    [Route("/api/danbooru")]
    public class NsfwDanbooruController : AbstractDanbooruController
    {
        protected override SourceBooru SourceBooru { get; }

        public NsfwDanbooruController(IDanbooruApi api, IMapper mapper, IDataProtectionProvider dataProtectorProvider) : base(api, mapper, dataProtectorProvider)
        {
            this.SourceBooru = new SourceBooru("danbooru", "Danbooru", "https://danbooru.donmai.us/");
        }
    }
}
