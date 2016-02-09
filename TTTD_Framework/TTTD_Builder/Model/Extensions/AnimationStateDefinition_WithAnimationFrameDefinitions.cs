using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Managers;
using TTTD_Builder.Model.Extensions.Base;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Model.Extensions
{
    public class AnimationStateDefinition_WithAnimationFrameDefinitions : ExtensionsBase, IHasName
    {
        #region MEMBER FIELDS

        private AnimationStateDefinition m_animationStateDefinition;

        private ObservableCollection<AnimationFrameDefinition> m_animationFrames = new ObservableCollection<AnimationFrameDefinition>();

        #endregion


        #region MEMBER PROPERTIES

        public AnimationStateDefinition AnimationStateDefinition
        {
            get { return m_animationStateDefinition; }
            set { if (value != m_animationStateDefinition) { m_animationStateDefinition = value; NotifyPropertyChanged("AnimationStateDefinition"); } }
        }

        public ObservableCollection<AnimationFrameDefinition> AnimationFrames
        {
            get { return m_animationFrames; }
            set { if (m_animationFrames != value) { m_animationFrames = value; NotifyPropertyChanged("AnimationFrames"); } }
        }

        public int Id
        {
            get { return m_animationStateDefinition.Id; }
        }

        public string Name
        {
            get { return m_animationStateDefinition.Name; }
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public AnimationStateDefinition_WithAnimationFrameDefinitions(AnimationStateDefinition animationStateDefinition)
        {
            m_animationStateDefinition = animationStateDefinition;

            m_animationFrames.AddRange(DataManager.AnimationFrameDefinitions.Where(x => x.AnimationStateDefinition == m_animationStateDefinition));
            DataManager.AnimationFrameDefinitions.CollectionChanged += AnimationFrameDefinitions_CollectionChanged;
        }

        ~AnimationStateDefinition_WithAnimationFrameDefinitions()
        {
            DataManager.AnimationFrameDefinitions.CollectionChanged -= AnimationFrameDefinitions_CollectionChanged;
        }

        public void Refresh()
        {
            m_animationFrames.Clear();
            AnimationFrames.AddRange(DataManager.AnimationFrameDefinitions
                .Where(x => x.AnimationStateDefinition == m_animationStateDefinition));
        }

        #endregion


        #region Private Functionality

        private void AnimationFrameDefinitions_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
            {
                foreach (var a in e.NewItems.OfType<AnimationFrameDefinition>())
                {
                    if (a.AnimationStateDefinition == m_animationStateDefinition)
                        AnimationFrames.Add(a);
                }
            }
        }

        #endregion

        #endregion
    }
}
