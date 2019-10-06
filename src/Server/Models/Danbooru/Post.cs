using System;

namespace BooruViewer.Models.Danbooru
{
    public class Post
    {
        public UInt64 Id { get; set; }
        public UInt64? ParentId { get; set; }
        public String ChildrenIds { get; set; }

        public Boolean HasChildren { get; set; }
        public Boolean HasVisibleChildren { get; set; }
        public Boolean HasActiveChildren { get; set; }

        public Int64? Score { get; set; }
        public UInt64 UpScore { get; set; }
        public Int64 DownScore { get; set; }

        public String Rating { get; set; }
        public Boolean IsRatingLocked { get; set; }

        public String Source { get; set; }
        public String Md5 { get; set; }

        public String TagStringArtist { get; set; }
        public String TagStringCharacter { get; set; }
        public String TagStringCopyright { get; set; }
        public String TagStringGeneral { get; set; }
        public String TagStringMeta { get; set; }

        public Boolean IsNoteLocked { get; set; }
        public Boolean IsStatusLocked { get; set; }
        public Boolean IsPending { get; set; }
        public Boolean IsFlagged { get; set; }
        public Boolean IsDeleted { get; set; }
        public Boolean IsBanned { get; set; }

        public UInt64 UploaderId { get; set; }
        public String UploaderName { get; set; }

        public UInt64? ApproverId { get; set; }

        public Int64 FavCount { get; set; }
        public Boolean IsFavorited { get; set; }

        public UInt64 ImageWidth { get; set; }
        public UInt64 ImageHeight { get; set; }

        public String FileExt { get; set; }
        public UInt64 FileSize { get; set; }
        public String FileUrl { get; set; }
        public Boolean HasLarge { get; set; }
        public String LargeFileUrl { get; set; }
        public String PreviewFileUrl { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public DateTimeOffset? LastNotedAt { get; set; }
        public DateTimeOffset? LastCommentedAt { get; set; }
        public DateTimeOffset? LastCommentBumpedAt { get; set; }
    }
}
