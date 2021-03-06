using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Sanitizer.Lib.Data
{
    public class GraphicsAnimationInstanceDefinition
    {
        public class AnimationStateDefinition
        {
            public class AnimationFrameDefinition
            {
                public int Id { get; set; }
                public string Name { get; set; }
                public int Frame { get; set; }
                public double? Duration { get; set; }
                public string Texture { get; set; }
                public double Width { get; set; }
                public double Height { get; set; }
                public double TexCoordTop { get; set; }
                public double TexCoordRight { get; set; }
                public double TexCoordBottom { get; set; }
                public double TexCoordLeft { get; set; }
            }

            public int Id { get; set; }
            public string Name { get; set; }
            public int State { get; set; }
            public AnimationFrameDefinition[] AnimationFrameDefinitions { get; set; }
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public int ZOrder { get; set; }
        public int RenderPass { get; set; }
        public AnimationStateDefinition[] AnimationStateDefinitions { get; set; }
    }
}