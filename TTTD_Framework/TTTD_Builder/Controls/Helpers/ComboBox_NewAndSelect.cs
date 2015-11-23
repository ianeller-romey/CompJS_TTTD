using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

using TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Controls.Helpers
{
    public class ComboBox_NewAndSelect<T> : ComboBox
    {
        #region MEMBER FIELDS

        private readonly ComboBoxItem c_comboBoxItem_new = new ComboBoxItem() { Content = "New ..." };
        private Action m_newFunc;
        private Action<T> m_selectedFunc;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public ComboBox_NewAndSelect(Action newFunc, Action<T> selectedFunc)
        {
            m_newFunc = newFunc;
            m_selectedFunc = selectedFunc;

            Items.Add(c_comboBoxItem_new);

            SelectionChanged += ComboBox_SelectionChanged;
        }

        public void DataCollection_CollectionChanged(object sender, System.Collections.Specialized.NotifyCollectionChangedEventArgs e)
        {
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
                foreach (var item in e.NewItems)
                    Items.Add(item);
            if (e.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Remove)
                foreach (var item in e.OldItems)
                    Items.Remove(item);
        }

        #endregion


        #region Private Functionality

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ComboBoxItem item = null;
            if ((item = SelectedItem as ComboBoxItem) != null)
            {
                if (item == c_comboBoxItem_new)
                    m_newFunc();
            }
            else
                m_selectedFunc((T)SelectedItem);
        }

        #endregion

        #endregion
    }
}
