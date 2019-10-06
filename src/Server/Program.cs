using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace BooruViewer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            var env = host.Services.GetService<IWebHostEnvironment>();
            if (!env.IsDevelopment())
            {
                var startSettings = new ProcessStartInfo("http://localhost:5000")
                    {UseShellExecute = true,};
                Process.Start(startSettings);
            }

            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}
