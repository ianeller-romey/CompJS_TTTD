using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

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
        UserControl_NewAndSelect<AnimationStateDefinition> m_comboBox_animationStateDefinition;
        UserControl_AnimationStateDefinition m_userControl_animationStateDefinition;
        UserControl_NewAndSelect<AnimationFrameDefinition> m_comboBox_animationFrameDefinition;
        //UserControl_AnimationFrameDefinition m_userControl_animationFrameDefinition;
        UserControl_NewAndSelect<FontTextureDefinition> m_comboBox_fontTextureDefinition;
        //UserControl_FontTextureDefinition m_userControl_fontTextureDefinition;

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
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });

            m_grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            m_grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });

            ////////
            // ComboBox
            m_comboBox_graphicsInstanceDefinitions = new UserControl_NewAndSelect<GraphicsInstanceDefinition>(DataManager.GraphicsInstanceDefinitions, NewGraphicsInstanceDefinition, SelectGraphicsInstanceDefinition);
            Grid.SetColumnSpan(m_comboBox_graphicsInstanceDefinitions, 2);
            m_grid_main.SetGridRowColumn(m_comboBox_graphicsInstanceDefinitions, 0, 0);


            ////////
            // Fin
            Content = m_grid_main;
        }

        private void SwitchToAnimationControls()
        {
            if (m_comboBox_fontTextureDefinition != null)
                m_grid_main.Children.Remove(m_comboBox_fontTextureDefinition);
            //if (m_userControl_fontTextureDefinition != null)
            //    m_grid_main.Children.Remove(m_userControl_fontTextureDefinition);

            m_comboBox_animationStateDefinition = new UserControl_NewAndSelect<AnimationStateDefinition>(DataManager.AnimationStateDefinitions, NewAnimationStateDefinition, SelectAnimationStateDefinition);
            m_grid_main.SetGridRowColumn(m_comboBox_animationStateDefinition, 1, 0);
        }

        private void SwitchToFontControls()
        {
        }

        private void RemoveUserControls()
        {
            if (m_userControl_graphicsInstanceDefinition != null)
                m_grid_main.Children.Remove(m_userControl_graphicsInstanceDefinition);
            m_userControl_graphicsInstanceDefinition = null;
        }

        private void NewGraphicsInstanceDefinition()
        {
            RemoveUserControls();
            m_userControl_graphicsInstanceDefinition = new UserControl_GraphicsInstanceDefinition();
            m_grid_main.SetGridRowColumn(m_userControl_graphicsInstanceDefinition, 1, 0);
        }

        private void SelectGraphicsInstanceDefinition(GraphicsInstanceDefinition graphicsInstanceDefinition)
        {
            RemoveUserControls();

            var graphicsInstanceDefinition_ex = new GraphicsInstanceDefinition_Ex() { GraphicsInstanceDefinition = graphicsInstanceDefinition };
            m_userControl_graphicsInstanceDefinition = new UserControl_GraphicsInstanceDefinition(graphicsInstanceDefinition_ex);
            m_grid_main.SetGridRowColumn(m_userControl_graphicsInstanceDefinition, 1, 0);
        }

        private void NewAnimationStateDefinition()
        {
            //RemoveUserControls();
            m_userControl_animationStateDefinition = new UserControl_AnimationStateDefinition(null);
            m_grid_main.SetGridRowColumn(m_userControl_animationStateDefinition, 1, 0);
        }

        private void SelectAnimationStateDefinition(AnimationStateDefinition animationStateDefinition)
        {
            //RemoveUserControls();
            m_userControl_animationStateDefinition = new UserControl_AnimationStateDefinition(animationStateDefinition);
            m_grid_main.SetGridRowColumn(m_userControl_animationStateDefinition, 1, 0);
        }

        #endregion

        #endregion
    }
}
