using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Managers;
using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.Model.Extensions
{
    public class GraphicsInstanceDefinition_WithFontTextureDefinitions : GraphicsInstanceDefinition_Ex
    {
        #region MEMBER FIELDS

        private ObservableCollection<FontTextureDefinition> m_fontTextures = new ObservableCollection<FontTextureDefinition>();

        #endregion


        #region MEMBER PROPERTIES

        public ObservableCollection<FontTextureDefinition> FontTextures
        {
            get { return m_fontTextures; }
            set { if (m_fontTextures != value) { m_fontTextures = value; NotifyPropertyChanged("FontTextures"); } }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public GraphicsInstanceDefinition_WithFontTextureDefinitions(GraphicsInstanceDefinition graphicsDefinition) :
            base(graphicsDefinition, GraphicsInstanceDefinitionType.Animation)
        {
            Refresh();
            DataManager.FontTextureDefinitions.CollectionChanged += FontTextureDefinitions_CollectionChanged;
        }

        ~GraphicsInstanceDefinition_WithFontTextureDefinitions()
        {
            DataManager.FontTextureDefinitions.CollectionChanged -= FontTextureDefinitions_CollectionChanged;
        }

        public override void Refresh()
        {
            m_fontTextures.Clear();
            m_fontTextures.AddRange(DataManager.FontTextureDefinitions
                .Where(x => x.GraphicsInstanceDefinition == m_graphicsInstanceDefinition));
        }

        #endregion


        #region Private Functionality

        private void FontTextureDefinitions_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var f in e.NewItems.OfType<FontTextureDefinition>())
                {
                    if (f.GraphicsInstanceDefinition == m_graphicsInstanceDefinition)
                        FontTextures.Add(f);
                }
            }
        }

        #endregion

        #endregion
    }
}
