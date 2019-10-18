using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.Primitives;

namespace BooruViewer.Controllers.Api
{
    public class ThumbnailController : Controller
    {
        private HttpClient _client;

        public ThumbnailController(IHttpClientFactory clientFactory)
        {
            this._client = clientFactory.CreateClient("thumbnailer");
        }

        [HttpGet("/api/thumbnail")]
        public async Task<FileResult> ThumbnailAsync(String imagePath, Int32 size)
        {
            if (imagePath[0] == '/') // TODO: Make it craft a url properly?
                imagePath = "http://localhost:5000" + imagePath;

            using var response = await this._client.GetAsync(imagePath);
            await using var imageData = await response.Content.ReadAsStreamAsync();

            using var image = Image.Load(imageData);

            var height = image.Height;
            var width = image.Width;

            var ratio = (Double) size / Math.Max(width, height);

            var newHeight = (Int32) Math.Min(Math.Floor(ratio * height), height);
            var newWidth = (Int32) Math.Min(Math.Floor(ratio * width), width);

            Image workingImage;
            if (image.Frames.Count == 1)
                workingImage = image;
            else workingImage = image.Frames.ExportFrame(0);

            using (workingImage)
            {
                workingImage.Mutate(x => x
                    .Resize(newWidth, newHeight));

                var outputStream = new MemoryStream();
                workingImage.SaveAsPng(outputStream);

                outputStream.Position = 0;


                return this.File(outputStream, "image/png");
            }
        }
    }
}
