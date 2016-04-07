using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.EditData;
using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Extensions;


namespace TTTD_Builder.Controls.TabControls
{
    public class TabItem_GraphicsInstanceDefinition : TabItem
    {
        #region MEMBER FIELDS

        Grid m_grid_main;
        UserControl_NewAndSelect<GraphicsInstanceDefinition> m_comboBox_graphicsInstanceDefinitions;
        UserControl_GraphicsInstanceDefinition m_userControl_graphicsInstanceDefinition;
        UserControl_NewAndSelect<AnimationStateDefinition_WithAnimationFrameDefinitions> m_comboBox_animationStateDefinition;
        UserControl_AnimationStateDefinition m_userControl_animationStateDefinition;
        UserControl_NewAndSelect<AnimationFrameDefinition> m_comboBox_animationFrameDefinition;
        UserControl_AnimationFrameDefinition m_userControl_animationFrameDefinition;
        UserControl_NewAndSelect<FontTextureDefinition> m_comboBox_fontTextureDefinition;
        UserControl_FontTextureDefinition m_userControl_fontTextureDefinition;

        GraphicsInstanceDefinition_Ex m_selectedGraphicsInstanceDefinition;
        AnimationStateDefinition_WithAnimationFrameDefinitions m_selectedAnimationStateDefinition;

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public TabItem_GraphicsInstanceDefinition()
        {
            Header = "Graphics Instance Definitions";
            CreateControls();
        }

        #endregion


        #region Private Functionality

        private void CreateControls()
        {
            m_grid_main = new Grid();

            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });

            m_grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(25.0, GridUnitType.Star) });
            m_grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(75.0, GridUnitType.Star) });

            ////////
            // ComboBox
            m_comboBox_graphicsInstanceDefinitions = new UserControl_NewAndSelect<GraphicsInstanceDefinition>(DataManager.GraphicsInstanceDefinitions, NewGraphicsInstanceDefinition, SelectGraphicsInstanceDefinition);
            m_grid_main.SetRowColumn(m_comboBox_graphicsInstanceDefinitions, 0, 0);
            
            ////////
            // Fin
            Content = m_grid_main;
        }

        private void AddAnimationStateControls()
        {
            RemoveFontTextureControls(true);

            RemoveAnimationStateControls(true);

            var g = m_selectedGraphicsInstanceDefinition as GraphicsInstanceDefinition_WithAnimationStateDefinitions;
            m_comboBox_animationStateDefinition = new UserControl_NewAndSelect<AnimationStateDefinition_WithAnimationFrameDefinitions>(g.AnimationStates, NewAnimationStateDefinition, SelectAnimationStateDefinition);
            m_comboBox_animationStateDefinition.SelectionChanged += ComboBox_AnimationStateDefinition_SelectionChanged;
            m_grid_main.SetRowColumn(m_comboBox_animationStateDefinition, 2, 0);

            if (m_comboBox_animationStateDefinition.SelectedItem != null)
            {
                m_selectedAnimationStateDefinition = m_comboBox_animationStateDefinition.SelectedItem;
                AddAnimationFrameControls();
            }
        }

        private void AddAnimationFrameControls()
        {
            RemoveFontTextureControls(true);

            RemoveAnimationFrameControls(true);

            m_comboBox_animationFrameDefinition = new UserControl_NewAndSelect<AnimationFrameDefinition>(m_selectedAnimationStateDefinition.AnimationFrames, NewAnimationFrameDefinition, SelectAnimationFrameDefinition);
            m_grid_main.SetRowColumn(m_comboBox_animationFrameDefinition, 0, 1);
        }

        private void AddFontControls()
        {
            RemoveAnimationStateControls(true);

            RemoveFontTextureControls(true);

            var g = m_selectedGraphicsInstanceDefinition as GraphicsInstanceDefinition_WithFontTextureDefinitions;
            m_comboBox_fontTextureDefinition = new UserControl_NewAndSelect<FontTextureDefinition>(g.FontTextures, NewFontTextureDefinition, SelectFontTextureDefinition);
            m_grid_main.SetRowColumn(m_comboBox_fontTextureDefinition, 0, 1);
        }

        private void RemoveUserControls()
        {
            if (m_userControl_graphicsInstanceDefinition != null)
                m_grid_main.Children.Remove(m_userControl_graphicsInstanceDefinition);
            m_userControl_graphicsInstanceDefinition = null;

            RemoveAnimationStateControls(true);

            RemoveFontTextureControls(true);
        }

        private void RemoveAnimationStateControls(bool removeComboBox)
        {
            if (m_userControl_animationStateDefinition != null)
            {
                m_grid_main.Children.Remove(m_userControl_animationStateDefinition);
                m_userControl_animationStateDefinition.NewDataAddedEvent -= UserControl_AnimationStateDefinition_NewDataAdded;
                m_userControl_animationStateDefinition.ExistingDataUpdatedEvent -= UserControl_AnimationStateDefinition_ExistingDataUpdated;
            }
            m_userControl_animationStateDefinition = null;

            if (removeComboBox)
            {
                if (m_comboBox_animationStateDefinition != null)
                    m_grid_main.Children.Remove(m_comboBox_animationStateDefinition);
                m_comboBox_animationStateDefinition = null;
            }

            RemoveAnimationFrameControls(true);
        }

        private void RemoveAnimationFrameControls(bool removeComboBox)
        {
            if (m_userControl_animationFrameDefinition != null)
            {
                m_grid_main.Children.Remove(m_userControl_animationFrameDefinition);
                m_userControl_animationFrameDefinition.NewDataAddedEvent -= UserControl_AnimationFrameDefinition_NewDataAdded;
                m_userControl_animationFrameDefinition.ExistingDataUpdatedEvent -= UserControl_AnimationFrameDefinition_ExistingDataUpdated;
            }
            m_userControl_animationFrameDefinition = null;

            if (removeComboBox)
            {
                if (m_comboBox_animationFrameDefinition != null)
                    m_grid_main.Children.Remove(m_comboBox_animationFrameDefinition);
                m_comboBox_animationFrameDefinition = null;
            }
        }

        private void RemoveFontTextureControls(bool removeComboBox)
        {
            if (m_userControl_fontTextureDefinition != null)
                m_grid_main.Children.Remove(m_userControl_fontTextureDefinition);
            m_userControl_fontTextureDefinition = null;

            if (removeComboBox)
            {
                if (m_comboBox_fontTextureDefinition != null)
                    m_grid_main.Children.Remove(m_comboBox_fontTextureDefinition);
                m_comboBox_fontTextureDefinition = null;
            }
        }

        private void NewGraphicsInstanceDefinition()
        {
            RemoveUserControls();
            m_userControl_graphicsInstanceDefinition = new UserControl_GraphicsInstanceDefinition();
            m_grid_main.SetRowColumn(m_userControl_graphicsInstanceDefinition, 1, 0);
        }

        private void SelectGraphicsInstanceDefinition(GraphicsInstanceDefinition graphicsInstanceDefinition)
        {
            RemoveUserControls();

            if(DataManager.AnimationStateDefinitions.Any(x => x.GraphicsInstanceDefinition == graphicsInstanceDefinition))
            {
                m_selectedGraphicsInstanceDefinition = new GraphicsInstanceDefinition_WithAnimationStateDefinitions(graphicsInstanceDefinition);
                AddAnimationStateControls();
            }
            else if (DataManager.FontTextureDefinitions.Any(x => x.GraphicsInstanceDefinition == graphicsInstanceDefinition))
            {
                m_selectedGraphicsInstanceDefinition = new GraphicsInstanceDefinition_WithFontTextureDefinitions(graphicsInstanceDefinition);
                AddFontControls();
            }
            else
            {
                // we might be trying to load GraphicsInstanceDefinitions before we've loaded the AnimationStateDefinitions or FontTextureDefinitions;
                // just be patient
                return;
            }

            m_userControl_graphicsInstanceDefinition = new UserControl_GraphicsInstanceDefinition(m_selectedGraphicsInstanceDefinition);
            m_grid_main.SetRowColumn(m_userControl_graphicsInstanceDefinition, 1, 0);
        }

        private void NewAnimationStateDefinition()
        {
            RemoveAnimationStateControls(false);
            m_userControl_animationStateDefinition = new UserControl_AnimationStateDefinition(null);
            m_userControl_animationStateDefinition.NewDataAddedEvent += UserControl_AnimationStateDefinition_NewDataAdded;
            m_userControl_animationStateDefinition.ExistingDataUpdatedEvent += UserControl_AnimationStateDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_animationStateDefinition, 3, 0);
        }

        private void SelectAnimationStateDefinition(AnimationStateDefinition_WithAnimationFrameDefinitions animationStateDefinition)
        {
            RemoveAnimationStateControls(false);
            m_userControl_animationStateDefinition = new UserControl_AnimationStateDefinition(animationStateDefinition.AnimationStateDefinition);
            m_userControl_animationStateDefinition.NewDataAddedEvent += UserControl_AnimationStateDefinition_NewDataAdded;
            m_userControl_animationStateDefinition.ExistingDataUpdatedEvent += UserControl_AnimationStateDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_animationStateDefinition, 3, 0);
        }

        private void NewAnimationFrameDefinition()
        {
            RemoveAnimationFrameControls(false);
            m_userControl_animationFrameDefinition = new UserControl_AnimationFrameDefinition(null);
            Grid.SetRowSpan(m_userControl_animationFrameDefinition, 4);
            m_userControl_animationFrameDefinition.NewDataAddedEvent += UserControl_AnimationFrameDefinition_NewDataAdded;
            m_userControl_animationFrameDefinition.ExistingDataUpdatedEvent += UserControl_AnimationFrameDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_animationFrameDefinition, 1, 1);
        }

        private void SelectAnimationFrameDefinition(AnimationFrameDefinition animationFrameDefinition)
        {
            RemoveAnimationFrameControls(false);
            m_userControl_animationFrameDefinition = new UserControl_AnimationFrameDefinition(animationFrameDefinition);
            Grid.SetRowSpan(m_userControl_animationFrameDefinition, 4);
            m_userControl_animationFrameDefinition.NewDataAddedEvent += UserControl_AnimationFrameDefinition_NewDataAdded;
            m_userControl_animationFrameDefinition.ExistingDataUpdatedEvent += UserControl_AnimationFrameDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_animationFrameDefinition, 1, 1);
        }

        private void NewFontTextureDefinition()
        {
            RemoveFontTextureControls(false);
            m_userControl_fontTextureDefinition = new UserControl_FontTextureDefinition(null);
            m_userControl_fontTextureDefinition.NewDataAddedEvent += UserControl_FontTextureDefinition_NewDataAdded;
            m_userControl_fontTextureDefinition.ExistingDataUpdatedEvent += UserControl_FontTextureDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_fontTextureDefinition, 1, 1);
        }

        private void SelectFontTextureDefinition(FontTextureDefinition fontTextureDefinition)
        {
            RemoveFontTextureControls(false);
            m_userControl_fontTextureDefinition = new UserControl_FontTextureDefinition(fontTextureDefinition);
            m_userControl_fontTextureDefinition.NewDataAddedEvent += UserControl_FontTextureDefinition_NewDataAdded;
            m_userControl_fontTextureDefinition.ExistingDataUpdatedEvent += UserControl_FontTextureDefinition_ExistingDataUpdated;
            m_grid_main.SetRowColumn(m_userControl_fontTextureDefinition, 1, 1);
        }

        private void UserControl_AnimationStateDefinition_NewDataAdded(int id)
        {
            var newAnimationStateDefinition = DataManager.AnimationStateDefinitions.FirstOrDefault(x => x.Id == id);
            if (newAnimationStateDefinition != null)
            {
                newAnimationStateDefinition.GraphicsInstanceDefinition = m_selectedGraphicsInstanceDefinition.GraphicsInstanceDefinition;
            }

            if (m_selectedGraphicsInstanceDefinition != null)
                m_selectedGraphicsInstanceDefinition.Refresh();
        }

        private void UserControl_AnimationStateDefinition_ExistingDataUpdated(int id)
        {
            if(m_selectedGraphicsInstanceDefinition != null)
                m_selectedGraphicsInstanceDefinition.Refresh();
        }

        private void UserControl_AnimationFrameDefinition_NewDataAdded(int id)
        {
            var newAnimationFrameDefinition = DataManager.AnimationFrameDefinitions.FirstOrDefault(x => x.Id == id);
            if (newAnimationFrameDefinition != null)
            {
                newAnimationFrameDefinition.AnimationStateDefinition = m_selectedAnimationStateDefinition.AnimationStateDefinition;
            }

            if(m_selectedAnimationStateDefinition != null)
                m_selectedAnimationStateDefinition.Refresh();
        }

        private void UserControl_AnimationFrameDefinition_ExistingDataUpdated(int id)
        {
            if (m_selectedAnimationStateDefinition != null)
                m_selectedAnimationStateDefinition.Refresh();
        }

        private void UserControl_FontTextureDefinition_NewDataAdded(int id)
        {
            var newFontTextureDefinition = DataManager.FontTextureDefinitions.FirstOrDefault(x => x.Id == id);
            if (newFontTextureDefinition != null)
            {
                newFontTextureDefinition.GraphicsInstanceDefinition = m_selectedGraphicsInstanceDefinition.GraphicsInstanceDefinition;
            }

            if (m_selectedGraphicsInstanceDefinition != null)
                m_selectedGraphicsInstanceDefinition.Refresh();
        }

        private void UserControl_FontTextureDefinition_ExistingDataUpdated(int id)
        {
            if (m_selectedGraphicsInstanceDefinition != null)
                m_selectedGraphicsInstanceDefinition.Refresh();
        }

        private void ComboBox_AnimationStateDefinition_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var comboBox = sender as UserControl_NewAndSelect<AnimationStateDefinition_WithAnimationFrameDefinitions>;
            if (comboBox != null && comboBox == m_comboBox_animationStateDefinition)
            {
                m_selectedAnimationStateDefinition = m_comboBox_animationStateDefinition.SelectedItem;
                if(m_selectedAnimationStateDefinition != null)
                    AddAnimationFrameControls();
            }
        }

        #endregion

        #endregion
    }
}
