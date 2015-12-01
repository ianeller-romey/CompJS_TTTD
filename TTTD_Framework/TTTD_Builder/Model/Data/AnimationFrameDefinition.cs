using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Model.Data.Base;


namespace TTTD_Builder.Model.Data
{
    public class AnimationFrameDefinition : DataBase
    {
        #region MEMBER FIELDS

        private AnimationStateDefinition m_animationStateDefinition;
        private int m_frame;
        private double? m_duration;
        private string m_texture;
        private double m_width;
        private double m_height;
        private double m_texCoordTop;
        private double m_texCoordRight;
        private double m_texCoordBottom;
        private double m_texCoordLeft;

        #endregion


        #region MEMBER PROPERTIES

        public AnimationStateDefinition AnimationStateDefinition
        {
            get { return m_animationStateDefinition; }
            set { if (value != m_animationStateDefinition) { m_animationStateDefinition = value; NotifyPropertyChanged("AnimationStateDefinition"); } }
        }

        public int Frame
        {
            get { return m_frame; }
            set { if (value != m_frame) { m_frame = value; NotifyPropertyChanged("Frame"); } }
        }

        public double? Duration
        {
            get { return m_duration; }
            set { if (value != m_duration) { m_duration = value; NotifyPropertyChanged("Duration"); } }
        }

        public string Texture
        {
            get { return m_texture; }
            set { if (value != m_texture) { m_texture = value; NotifyPropertyChanged("Texture"); } }
        }

        public double Width
        {
            get { return m_width; }
            set { if (value != m_width) { m_width = value; NotifyPropertyChanged("Width"); } }
        }

        public double Height
        {
            get { return m_height; }
            set { if (value != m_height) { m_height = value; NotifyPropertyChanged("Height"); } }
        }

        public double TexCoordTop
        {
            get { return m_texCoordTop; }
            set { if (value != m_texCoordTop) { m_texCoordTop = value; NotifyPropertyChanged("TexCoordTop"); } }
        }

        public double TexCoordRight
        {
            get { return m_texCoordRight; }
            set { if (value != m_texCoordRight) { m_texCoordRight = value; NotifyPropertyChanged("TexCoordRight"); } }
        }

        public double TexCoordBottom
        {
            get { return m_texCoordBottom; }
            set { if (value != m_texCoordBottom) { m_texCoordBottom = value; NotifyPropertyChanged("TexCoordBottom"); } }
        }

        public double TexCoordLeft
        {
            get { return m_texCoordLeft; }
            set { if (value != m_texCoordLeft) { m_texCoordLeft = value; NotifyPropertyChanged("TexCoordLeft"); } }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        protected override string NameAnd()
        {
            return string.Format("{0}: Frame {1}, {2}", Id, Frame, Name);
        }

        #endregion

        #endregion

    }
}
