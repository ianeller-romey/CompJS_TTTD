using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class AnimationFrameDefinition
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int AnimationStateDefinitionId { get; set; }
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
}