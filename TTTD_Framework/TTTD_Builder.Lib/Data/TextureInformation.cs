using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace TTTD_Builder.Lib.Data
{
    public class TextureInformation
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Texture { get; set; }
        public double TextureWidth { get; set; }
        public double TextureHeight { get; set; }
        public double StepX { get; set; }
        public double StepY { get; set; }
    }
}