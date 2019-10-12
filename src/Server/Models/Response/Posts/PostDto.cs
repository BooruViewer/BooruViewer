using System;
using System.Collections.Generic;

namespace BooruViewer.Models.Response.Posts
{
    public class PostDto
    {
        public UInt64 Id { get; set; }
        public UInt64? ParentId { get; set; }
        // TODO: Add a ICollection<PostDto> for the child posts?
        public ICollection<UInt64> ChildIds { get; set;  }

        public Boolean HasChildren => this.ChildIds.Count > 0;

        public Boolean IsVisible { get; set;  }
        public Boolean IsPending { get; set; }
        public Boolean IsDeleted { get; set; }

        public Boolean? HasNotes { get; set; }

        public String Hash { get; set;  }

        public Int64? Score { get;  set; }
        public UInt64 Favourites { get;  set; }
        public Boolean IsFavourited { get; set;  }

        public DateTimeOffset UploadedAt { get; set;  }
        public DateTimeOffset? LastModifiedAt { get; set;  }

        public Rating Rating { get;  set; }

        public FilesDto Files { get;  set; }
        public SizeDto Size { get;  set; }
        public UploaderDto Uploader { get;  set; }
        public SourceDto Source { get;  set; }
        public ICollection<TagDto> Tags { get;  set; }
        public Dictionary<String, Object> BooruData { get; set; }

        public PostDto()
        {
            this.ChildIds = new List<UInt64>();
            this.Tags = new List<TagDto>();
            this.BooruData = new Dictionary<String, Object>();
        }
    }
}
