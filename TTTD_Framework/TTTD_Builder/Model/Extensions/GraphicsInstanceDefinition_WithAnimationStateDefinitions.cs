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
    public class GraphicsInstanceDefinition_WithAnimationStateDefinitions : GraphicsInstanceDefinition_Ex
    {
        #region MEMBER FIELDS

        private ObservableCollection<AnimationStateDefinition_WithAnimationFrameDefinitions> m_animationStates = new ObservableCollection<AnimationStateDefinition_WithAnimationFrameDefinitions>();

        #endregion


        #region MEMBER PROPERTIES

        public ObservableCollection<AnimationStateDefinition_WithAnimationFrameDefinitions> AnimationStates
        {
            get { return m_animationStates; }
            set { if (m_animationStates != value) { m_animationStates = value; NotifyPropertyChanged("AnimationStates"); } }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public GraphicsInstanceDefinition_WithAnimationStateDefinitions(GraphicsInstanceDefinition graphicsDefinition) :
            base(graphicsDefinition, GraphicsInstanceDefinitionType.Animation)
        {
            Refresh();
            DataManager.AnimationStateDefinitions.CollectionChanged += AnimationStateDefinitions_CollectionChanged;
        }

        ~GraphicsInstanceDefinition_WithAnimationStateDefinitions()
        {
            DataManager.AnimationStateDefinitions.CollectionChanged -= AnimationStateDefinitions_CollectionChanged;
        }

        public override void Refresh()
        {
            var queried = DataManager.AnimationStateDefinitions
                .Where(x => x.GraphicsInstanceDefinition == m_graphicsInstanceDefinition)
                .Select(x => new AnimationStateDefinition_WithAnimationFrameDefinitions(x)).ToList();
            m_animationStates.RemoveRange(m_animationStates.ToList().Where(x => !queried.Contains(x)));
            m_animationStates.AddRange(queried.Where(x => !m_animationStates.Contains(x)));
            NotifyPropertyChanged("AnimationStates");
        }

        #endregion


        #region Private Functionality

        private void AnimationStateDefinitions_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var a in e.NewItems.OfType<AnimationStateDefinition>())
                {
                    if (a.GraphicsInstanceDefinition == m_graphicsInstanceDefinition)
                        AnimationStates.Add(new AnimationStateDefinition_WithAnimationFrameDefinitions(a));
                }
            }
        }

        #endregion

        #endregion
    }
}
