using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Base;


namespace TTTD_Builder.Model.Data
{
    public class FontTextureDefinition : DataBase
    {
        #region MEMBER FIELDS

        private GraphicsInstanceDefinition m_graphicInstanceDefinition;
        private string m_texture;
        private double m_textureWidth;
        private double m_startTop;
        private double m_startLeft;
        private double m_characterWidth;
        private double m_characterHeight;

        #endregion


        #region MEMBER PROPERTIES

        public GraphicsInstanceDefinition GraphicsInstanceDefinition
        {
            get { return m_graphicInstanceDefinition; }
            set { if (value != m_graphicInstanceDefinition) { m_graphicInstanceDefinition = value; NotifyPropertyChanged("GraphicsInstanceDefinition"); } }
        }

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

        public double StartTop
        {
            get { return m_startTop; }
            set { if (value != m_startTop) { m_startTop = value; NotifyPropertyChanged("StartTop"); } }
        }

        public double StartLeft
        {
            get { return m_startLeft; }
            set { if (value != m_startLeft) { m_startLeft = value; NotifyPropertyChanged("StartLeft"); } }
        }

        public double CharacterWidth
        {
            get { return m_characterWidth; }
            set { if (value != m_characterWidth) { m_characterWidth = value; NotifyPropertyChanged("CharacterWidth"); } }
        }

        public double CharacterHeight
        {
            get { return m_characterHeight; }
            set { if (value != m_characterHeight) { m_characterHeight = value; NotifyPropertyChanged("CharacterHeight"); } }
        }


        #endregion
    }
}
