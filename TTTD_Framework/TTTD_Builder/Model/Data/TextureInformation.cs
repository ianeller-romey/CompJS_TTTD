using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class TextureInformation : DataBase
    {
        #region MEMBER FIELDS

        private string m_texture;
        private double m_textureWidth;
        private double m_textureHeight;
        private double m_stepX;
        private double m_stepY;

        #endregion


        #region MEMBER PROPERTIES

        public string Texture
        {
            get { return m_texture; }
            set { if (value != m_texture) { m_texture = value; NotifyPropertyChanged("Texture"); } }
        }

        public double TextureWidth
        {
            get { return m_textureWidth; }
            set { if (value != m_textureWidth) { m_textureWidth = value; NotifyPropertyChanged("TextureWidth"); } }
        }

        public double TextureHeight
        {
            get { return m_textureHeight; }
            set { if (value != m_textureHeight) { m_textureHeight = value; NotifyPropertyChanged("TextureHeight"); } }
        }

        public double StepX
        {
            get { return m_stepX; }
            set { if (value != m_stepX) { m_stepX = value; NotifyPropertyChanged("StepX"); } }
        }

        public double StepY
        {
            get { return m_stepY; }
            set { if (value != m_stepY) { m_stepY = value; NotifyPropertyChanged("StepY"); } }
        }


        #endregion
    }
}
