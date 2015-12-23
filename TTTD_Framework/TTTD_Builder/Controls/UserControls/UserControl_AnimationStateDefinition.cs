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


namespace TTTD_Builder.Controls
{
    public class UserControl_AnimationStateDefinition : UserControl_EditData
    {
        #region MEMBER FIELDS

        private AnimationStateDefinition m_animationStateDefinition;

        private TextBlock m_textBlock_id;
        private TextBox m_textBox_name;
        private IntegerUpDown m_integerUpDown_state;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_AnimationStateDefinition(AnimationStateDefinition animationStateDefinition) :
            base("Animation State Definition", false)
        {
            m_animationStateDefinition = animationStateDefinition;

            if (DataIsNull())
            {
                m_textBlock_id.Text = "N/A";
                m_textBox_name.Text = string.Empty;
                m_integerUpDown_state.Value = null;
            }
            else
            {
                m_textBlock_id.Text = m_animationStateDefinition.Id.ToString();
                m_textBox_name.Text = m_animationStateDefinition.Name;
                m_integerUpDown_state.Value = m_animationStateDefinition.State;
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
            ValidatorPanel validator_name = new ValidatorPanel(m_textBox_name, TextBox.TextProperty, new Validate_StringIsNotNullOrEmpty());
            Label label_name = new Label() { Content = "Name: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_name = new Grid();
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_name.SetGridRowColumn(validator_name, 1, 0);
            grid_name.SetGridRowColumn(label_name, 0, 0);
            grid_main.SetGridRowColumn(grid_name, 1, 0);

            ////////
            // State
            m_integerUpDown_state = new IntegerUpDown() { VerticalAlignment = VerticalAlignment.Center };
            ValidatorPanel validator_state = new ValidatorPanel(m_integerUpDown_state, IntegerUpDown.ValueProperty, new Validate_NotNull());
            Label label_state = new Label() { Content = "State: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            Grid grid_state = new Grid();
            grid_state.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_state.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            grid_state.SetGridRowColumn(validator_state, 1, 0);
            grid_state.SetGridRowColumn(label_state, 0, 0);
            grid_main.SetGridRowColumn(grid_state, 2, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = grid_main, FirstFocus = m_textBox_name, Validators = new ValidatorBase[] {
                validator_name,
                validator_state
            }};
        }

        protected override bool DataIsNull()
        {
            return m_animationStateDefinition == null;
        }

        protected override void AddNewData()
        {
            m_animationStateDefinition = DataManager.Generate<AnimationStateDefinition>();
            m_animationStateDefinition.Name = m_textBox_name.Text;
            m_animationStateDefinition.State = m_integerUpDown_state.Value.Value;

            DataManager.AnimationStateDefinitions.Add(m_animationStateDefinition);
        }

        protected override void UpdateExistingData()
        {
            m_animationStateDefinition.Name = m_textBox_name.Text;
            m_animationStateDefinition.State = m_integerUpDown_state.Value.Value;
        }

        protected override void RevertNewData()
        {
            m_textBox_name.Text = string.Empty;
            m_integerUpDown_state.Value = 0;
        }

        protected override void RevertExistingData()
        {
            m_textBox_name.Text = m_animationStateDefinition.Name;
            m_integerUpDown_state.Value = m_animationStateDefinition.State;
        }

        #endregion

        #endregion
    }
}
