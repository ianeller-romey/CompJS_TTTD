using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;
using TTTD_Builder.Model.Extensions;


namespace TTTD_Builder.EditData
{
    public class UserControl_GraphicsInstanceDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private GraphicsInstanceDefinition m_graphicsInstanceDefinition;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private ComboBox m_comboBox_entityInstanceDefinition;
        private IntegerUpDown m_integerUpDown_zOrder;
        private IntegerUpDown m_integerUpDown_renderPass;
        private GroupBox m_groupBox_type;
        private RadioButton m_radioButton_animation,
                            m_radioButton_font;

        #endregion


        #region MEMBER PROPERTIES

        private GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType GraphicsInstanceDefinitionType
        {
            get;
            set;
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_GraphicsInstanceDefinition() :
            base("Graphics Instance Type Definition", false)
        {
            m_graphicsInstanceDefinition = null;

            GraphicsInstanceDefinitionType = GraphicsInstanceDefinition_Ex.GraphicsInstanceDefinitionType.Undetermined;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_integerUpDown_zOrder.Value = null;
                m_integerUpDown_renderPass.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_graphicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
                m_integerUpDown_zOrder.Value = m_graphicsInstanceDefinition.ZOrder;
                m_integerUpDown_renderPass.Value = m_graphicsInstanceDefinition.RenderPass;
            }
        }

        public UserControl_GraphicsInstanceDefinition(GraphicsInstanceDefinition_Ex graphicsInstanceDefinition_ex) :
            base("Graphics Instance Type Definition", false)
        {
            m_graphicsInstanceDefinition = graphicsInstanceDefinition_ex.GraphicsInstanceDefinition;

            GraphicsInstanceDefinitionType = graphicsInstanceDefinition_ex.TypeOfInstance;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_integerUpDown_zOrder.Value = null;
                m_integerUpDown_renderPass.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_graphicsInstanceDefinition.Id.ToString();
                m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
                m_integerUpDown_zOrder.Value = m_graphicsInstanceDefinition.ZOrder;
                m_integerUpDown_renderPass.Value = m_graphicsInstanceDefinition.RenderPass;
            }
        }

        #endregion


        #region Private Functionality

        protected override void SetThisContent()
        {
            Grid grid_main = new Grid();
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
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
            grid_id.SetRowColumn(m_textBlock_id, 0, 1);
            grid_id.SetRowColumn(label_id, 0, 0);
            grid_main.SetRowColumn(grid_id, 0, 0);

            ////////
            // Name
            m_textBox_name = new TextBox() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetRowColumn(validator_name, 1, 0);
            grid_name.SetRowColumn(label_name, 0, 0);
            grid_main.SetRowColumn(grid_name, 1, 0);

            ////////
            // EntityInstanceDefinition
            CollectionViewSource collectionViewSource_entityInstanceDefinition =
                new CollectionViewSource()
                {
                    Source = DataManager.EntityInstanceDefinitions
                };
            m_comboBox_entityInstanceDefinition =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            m_comboBox_entityInstanceDefinition.SetBinding(ItemsControl.ItemsSourceProperty, new Binding() { Source = collectionViewSource_entityInstanceDefinition });
            ValidatorPanel validator_entityInstanceDefinition = new ValidatorPanel(m_comboBox_entityInstanceDefinition, ComboBox.SelectedItemProperty, new Validate_NotNull());

            Label label_entityInstanceDefinition = new Label() { Content = "Entity Instance: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_entityInstanceDefinition = new Grid();
            grid_entityInstanceDefinition.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_entityInstanceDefinition.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_entityInstanceDefinition.SetRowColumn(validator_entityInstanceDefinition, 1, 0);
            grid_entityInstanceDefinition.SetRowColumn(label_entityInstanceDefinition, 0, 0);
            grid_main.SetRowColumn(grid_entityInstanceDefinition, 2, 0);

            ////////
            // ZOrder
            m_integerUpDown_zOrder = new IntegerUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_zOrder = new ValidatorPanel(m_integerUpDown_zOrder, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_zOrder = new Label() { Content = "Z-Order: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_zOrder = new Grid();
            grid_zOrder.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_zOrder.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_zOrder.SetRowColumn(validator_zOrder, 1, 0);
            grid_zOrder.SetRowColumn(label_zOrder, 0, 0);
            grid_main.SetRowColumn(grid_zOrder, 3, 0);

            ////////
            // RenderPass
            m_integerUpDown_renderPass = new IntegerUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_renderPass = new ValidatorPanel(m_integerUpDown_renderPass, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_renderPass = new Label() { Content = "Render Pass: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_renderPass = new Grid();
            grid_renderPass.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_renderPass.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_renderPass.SetRowColumn(validator_renderPass, 1, 0);
            grid_renderPass.SetRowColumn(label_renderPass, 0, 0);
            grid_main.SetRowColumn(grid_renderPass, 4, 0);

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
            grid_radioButtons.SetRowColumn(m_radioButton_animation, 0, 0);
            grid_radioButtons.SetRowColumn(label_radioButton_animation, 0, 1);
            grid_radioButtons.SetRowColumn(m_radioButton_font, 1, 0);
            grid_radioButtons.SetRowColumn(label_radioButton_font, 1, 1);
            MultiValidatorPanel validator_radioButtons = new MultiValidatorPanel(grid_radioButtons, new[] {
                    m_radioButton_animation,
                    m_radioButton_font
                },
                RadioButton.IsCheckedProperty,
                new Validate_True(),
                MultiValidatorPanel.ValidationAggregationType.Or);

            m_groupBox_type = new GroupBox() { Header = "Type", Content = validator_radioButtons };

            grid_main.SetRowColumn(m_groupBox_type, 5, 0);

            if (GraphicsInstanceDefinitionType != GraphicsInstanceDefinition_WithAnimationStateDefinitions.GraphicsInstanceDefinitionType.Undetermined)
            {
                switch (GraphicsInstanceDefinitionType)
                {
                    case GraphicsInstanceDefinition_WithAnimationStateDefinitions.GraphicsInstanceDefinitionType.Animation:
                        m_radioButton_animation.IsChecked = true;
                        break;
                    case GraphicsInstanceDefinition_WithAnimationStateDefinitions.GraphicsInstanceDefinitionType.Font:
                        m_radioButton_font.IsChecked = true;
                        break;
                }
                m_groupBox_type.IsEnabled = false;
            }

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_entityInstanceDefinition,
                validator_zOrder,
                validator_renderPass,
                validator_radioButtons
            }};
        }

        protected override bool DataIsNull()
        {
            return m_graphicsInstanceDefinition == null;
        }

        protected override int AddNewData()
        {
            m_graphicsInstanceDefinition = DataManager.Generate<GraphicsInstanceDefinition>();
            m_graphicsInstanceDefinition.Name = m_textBox_name.Text;
            m_graphicsInstanceDefinition.EntityInstanceDefinition = m_comboBox_entityInstanceDefinition.SelectedItem as EntityInstanceDefinition;
            m_graphicsInstanceDefinition.ZOrder = m_integerUpDown_zOrder.Value.Value;
            m_graphicsInstanceDefinition.RenderPass = m_integerUpDown_renderPass.Value.Value;

            // we need to add the AnimationStateDefinition or FontTextureDefinition first, or we won't
            // be able to select the appropriate GraphicsInstanceDefinition in the ComboBox
            if (m_radioButton_animation.IsChecked.HasValue && m_radioButton_animation.IsChecked.Value)
            {
                var animationStateDefinition = DataManager.Generate<AnimationStateDefinition>();
                animationStateDefinition.GraphicsInstanceDefinition = m_graphicsInstanceDefinition;
                animationStateDefinition.Name = string.Format("{0} State 0", m_graphicsInstanceDefinition.Name);
                DataManager.AnimationStateDefinitions.Add(animationStateDefinition);

                var animationFrameDefinition = DataManager.Generate<AnimationFrameDefinition>();
                animationFrameDefinition.AnimationStateDefinition = animationStateDefinition;
                animationFrameDefinition.Name = string.Format("{0} Frame 0", animationStateDefinition.Name);
                DataManager.AnimationFrameDefinitions.Add(animationFrameDefinition);
            }
            else if (m_radioButton_font.IsChecked.HasValue && m_radioButton_font.IsChecked.Value)
            {
                var fontTextureDefinition = DataManager.Generate<FontTextureDefinition>();
                fontTextureDefinition.GraphicsInstanceDefinition = m_graphicsInstanceDefinition;
                DataManager.FontTextureDefinitions.Add(fontTextureDefinition);
            }

            DataManager.GraphicsInstanceDefinitions.Add(m_graphicsInstanceDefinition);

            return m_graphicsInstanceDefinition.Id;
        }

        protected override int UpdateExistingData()
        {
            m_graphicsInstanceDefinition.Name = m_textBox_name.Text;
            m_graphicsInstanceDefinition.ZOrder = m_integerUpDown_zOrder.Value.Value;
            m_graphicsInstanceDefinition.RenderPass = m_integerUpDown_renderPass.Value.Value;

            return m_graphicsInstanceDefinition.Id;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_radioButton_animation.IsChecked = false;
            m_radioButton_font.IsChecked = false;
            m_integerUpDown_zOrder.Value = null;
            m_integerUpDown_renderPass.Value = null;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_graphicsInstanceDefinition.Name;
            m_integerUpDown_zOrder.Value = m_graphicsInstanceDefinition.ZOrder;
            m_integerUpDown_renderPass.Value = m_graphicsInstanceDefinition.RenderPass;
        }

        #endregion

        #endregion
    }
}
