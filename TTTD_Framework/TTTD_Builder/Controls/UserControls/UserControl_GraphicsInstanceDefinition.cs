using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Extensions;


namespace TTTD_Builder.Controls
{
    public class UserControl_GraphicsInstanceDefinition : UserControl
    {
        #region MEMBER FIELDS

        private GraphicsInstanceDefinition m_graphicsInstanceDefinition;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        GroupBox m_groupBox_type;
        RadioButton m_radioButton_animation,
                    m_radioButton_font;
        private Grid_Activatable m_groupBox;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_GraphicsInstanceDefinition()
        {
            m_graphicsInstanceDefinition = null;

            CreateControls(GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Undetermined);

            if (m_graphicsInstanceDefinition == null)
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_graphicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
            }
        }

        public UserControl_GraphicsInstanceDefinition(GraphicsInstanceDefinition_Ex graphicsInstanceDefinition_ex)
        {
            m_graphicsInstanceDefinition = graphicsInstanceDefinition_ex.GraphicsInstanceDefinition;

            CreateControls(graphicsInstanceDefinition_ex.Type);

            if (m_graphicsInstanceDefinition == null)
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
            }
            else
            {
                m_textBlock_id.Text = m_graphicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
            }
        }

        #endregion


        #region Private Functionality

        private void CreateControls(GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType graphicsInstanceDefinitionType)
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // Id
            m_textBlock_id = new TextBlock() { VerticalAlignment = VerticalAlignment.Center };
            Label label_id = new Label() { Content = "Id: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_id = new Grid();
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_id.SetGridRowColumn(m_textBlock_id, 0, 1);
            grid_id.SetGridRowColumn(label_id, 0, 0);
            grid_main.SetGridRowColumn(grid_id, 0, 0);

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(m_textBox_name, 1, 0);
            grid_name.SetGridRowColumn(label_name, 0, 0);
            grid_main.SetGridRowColumn(grid_name, 1, 0);

            ////////
            // GroupBox and RadioButtons
            m_radioButton_animation = new RadioButton() { HorizontalAlignment = System.Windows.HorizontalAlignment.Left, VerticalAlignment = System.Windows.VerticalAlignment.Center };
            m_radioButton_font = new RadioButton() { HorizontalAlignment = System.Windows.HorizontalAlignment.Left, VerticalAlignment = System.Windows.VerticalAlignment.Center };
            Label label_radioButton_animation = new Label() { Content = "Animation", HorizontalAlignment = System.Windows.HorizontalAlignment.Left, VerticalAlignment = System.Windows.VerticalAlignment.Center };
            Label label_radioButton_font = new Label() { Content = "Font", HorizontalAlignment = System.Windows.HorizontalAlignment.Left, VerticalAlignment = System.Windows.VerticalAlignment.Center };

            Grid grid_radioButtons = new Grid();
            grid_radioButtons.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_radioButtons.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_radioButtons.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_radioButtons.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });
            grid_radioButtons.SetGridRowColumn(m_radioButton_animation, 0, 0);
            grid_radioButtons.SetGridRowColumn(label_radioButton_animation, 0, 1);
            grid_radioButtons.SetGridRowColumn(m_radioButton_font, 1, 0);
            grid_radioButtons.SetGridRowColumn(label_radioButton_font, 1, 1);
            MultiValidatorPanel radioButtons_validator = new MultiValidatorPanel(grid_radioButtons, new[] {
                    m_radioButton_animation,
                    m_radioButton_font
                },
                RadioButton.IsCheckedProperty,
                new Validate_True(),
                MultiValidatorPanel.ValidationAggregationType.Or);

            m_groupBox_type = new GroupBox() { Header = "Type", Content = radioButtons_validator };

            grid_main.SetGridRowColumn(m_groupBox_type, 2, 0);

            if (graphicsInstanceDefinitionType != GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Undetermined)
            {
                switch (graphicsInstanceDefinitionType)
                {
                    case GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Animation:
                        m_radioButton_animation.IsChecked = true;
                        break;
                    case GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Font:
                        m_radioButton_font.IsChecked = true;
                        break;
                }
                m_groupBox_type.IsEnabled = false;
            }

            ////////
            // GroupBox
            m_groupBox = new Grid_Activatable("Graphics Instance Definition", grid_main, new [] {
                radioButtons_validator
            }, false);
            m_groupBox.ChangesAccepted += () =>
                {
                    if (m_graphicsInstanceDefinition == null)
                        AddNewData();
                    else
                        UpdateExistingData();
                };
            m_groupBox.ChangesCancelled += () =>
                {
                    if (m_graphicsInstanceDefinition == null)
                        RevertData();
                    else
                        RevertExistingData();
                };
            Content = m_groupBox;            
        }

        private void AddNewData()
        {
            m_graphicsInstanceDefinition = DataManager.Generate<GraphicsInstanceDefinition>();
            m_graphicsInstanceDefinition.Name = m_textBox_name.Text;

            DataManager.GraphicsInstanceDefinitions.Add(m_graphicsInstanceDefinition);

            if (m_radioButton_animation.IsChecked.HasValue && m_radioButton_animation.IsChecked.Value)
            {
                var animationStateDefinition = DataManager.Generate<AnimationStateDefinition>();
                animationStateDefinition.GraphicsInstanceDefinition = m_graphicsInstanceDefinition;
                DataManager.AnimationStateDefinitions.Add(animationStateDefinition);
            }
            else if (m_radioButton_font.IsChecked.HasValue && m_radioButton_font.IsChecked.Value)
            {
                var fontTextureDefinition = DataManager.Generate<FontTextureDefinition>();
                fontTextureDefinition.GraphicsInstanceDefinition = m_graphicsInstanceDefinition;
                DataManager.FontTextureDefinitions.Add(fontTextureDefinition);
            }

        }

        private void UpdateExistingData()
        {
            m_graphicsInstanceDefinition.Name = m_textBox_name.Text;
        }

        private void RevertData()
        {
            m_textBox_name.Text = string.Empty;
            m_radioButton_animation.IsChecked = false;
            m_radioButton_font.IsChecked = false;
        }

        private void RevertExistingData()
        {
            m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
        }

        #endregion

        #endregion
    }
}
