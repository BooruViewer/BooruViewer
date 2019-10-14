using System;
using System.IO.Compression;
using Nuke.Common;
using Nuke.Common.Execution;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.DotNet;
using Nuke.Common.Tools.GitVersion;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using static Nuke.Common.Tools.DotNet.DotNetTasks;

[CheckBuildProjectConfigurations]
[UnsetVisualStudioEnvironmentVariables]
class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode
    public static int Main() => Execute<Build>(x => x.Compile);

    [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
    readonly Configuration Configuration = Configuration.Release;

    [Parameter("Run the IL Linker against the published app")] readonly Boolean Linker = true;
    [Parameter("Should the app be published as a single file")] readonly Boolean SingleFile = true;

    [Parameter("The project to publish")] readonly String Project = "BooruViewer Server";

    [Solution] readonly Solution Solution;
    [GitRepository] readonly GitRepository GitRepository;
    [GitVersion] readonly GitVersion GitVersion;

    AbsolutePath SourceDirectory => RootDirectory / "src" / "Server";
    AbsolutePath ArtifactsDirectory => RootDirectory / "artifacts";

    Target Clean => _ => _
        .Before(Restore)
        .Executes(() =>
        {
            SourceDirectory.GlobDirectories("**/bin", "**/obj").ForEach(DeleteDirectory);
            EnsureCleanDirectory(ArtifactsDirectory);
        });

    Target Restore => _ => _
        .Executes(() =>
        {
            DotNetRestore(s => s
                .SetProjectFile(Solution));
        });

    Target Compile => _ => _
        .DependsOn(Restore)
        .Executes(() =>
        {
            DotNetBuild(s => s
                .SetProjectFile(Solution)
                .SetConfiguration(Configuration)
                .SetAssemblyVersion(GitVersion.GetNormalizedAssemblyVersion())
                .SetFileVersion(GitVersion.GetNormalizedFileVersion())
                .SetInformationalVersion(GitVersion.InformationalVersion)
                .EnableNoRestore());
        });

    Target Publish => _ => _
        .DependsOn(Clean)
        .DependsOn(Restore)
        .Executes(() =>
        {
            var project = Solution.GetProject(Project);
            var runtimes = new[] {"win-x64", "linux-x64"};
            var r2r = new[] {true, false};

            var builds = new ValueTuple<String, Boolean>[runtimes.Length];

            for (var i = 0; i < runtimes.Length; i++)
            {
                builds[i] = (runtimes[i], r2r[i]);
            }

            DotNetPublish(o => o.EnableNoRestore()
                .SetConfiguration(Configuration)
                .SetProject(project)
                .SetSelfContained(true)
                .SetProperty("PublishSingleFile", SingleFile)
                .SetProperty("PublishTrimmed", Linker)
                .CombineWith(builds, (o2, build) => o2
                    .SetRuntime(build.Item1)
                    .SetOutput(ArtifactsDirectory / "BooruViewer" / build.Item1)
                    .SetProperty("PublishReadyToRun", build.Item2)));

            foreach (var runtime in runtimes)
            {
                CompressionTasks.CompressZip(ArtifactsDirectory / "BooruViewer" / runtime, ArtifactsDirectory / $"BooruViewer {runtime} ({GitVersion.BranchName.Replace("/", "-")}-{GitVersion.Sha}).zip", null, CompressionLevel.Optimal);
            }
        });
}
