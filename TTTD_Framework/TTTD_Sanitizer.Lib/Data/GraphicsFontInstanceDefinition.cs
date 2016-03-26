using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Sanitizer.Lib.Data
{
    public class GraphicsFontInstanceDefinition
    {
        public class FontTextureDefinition
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Texture { get; set; }
            public double TextureWidth { get; set; }
            public double StartTop { get; set; }
            public double StartLeft { get; set; }
            public double CharacterWidth { get; set; }
            public double CharacterHeight { get; set; }
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public int EntityInstanceDefinitionId { get; set; }
        public int RenderPass { get; set; }
        public FontTextureDefinition Font { get; set; }
    }
}