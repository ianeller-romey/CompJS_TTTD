﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;

using TTTD_Builder.Model.Interfaces;


namespace TTTD_Builder.Controls.Helpers
{
    public class UserControl_NewAndSelect<T> : UserControl where T : class, IHasName
    {
        #region MEMBER FIELDS

        private CollectionViewSource m_collectionViewSource;
        private Action m_newFunc;
        private Action<T> m_selectedFunc;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_NewAndSelect(ObservableCollection<T> collection, Action newFunc, Action<T> selectedFunc)
        {
            m_collectionViewSource =
                new CollectionViewSource()
                {
                    Source = collection
                };
            m_newFunc = newFunc;
            m_selectedFunc = selectedFunc;

            ////////
            // controls
            Grid grid_main = new Grid();
            grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_main.ColumnDefinitions.Add(new ColumnDefinition() { Width = new GridLength(100.0, GridUnitType.Star) });

            ////////
            // combobox
            ComboBox comboBox =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            comboBox.SetBinding(ItemsControl.ItemsSourceProperty, new Binding { Source = m_collectionViewSource });
            comboBox.SelectionChanged += ComboBox_SelectionChanged;
            collection.CollectionChanged += (x, y) =>
                {
                    if (y.Action == System.Collections.Specialized.NotifyCollectionChangedAction.Add)
                        comboBox.SelectedItem = y.NewItems.OfType<T>().FirstOrDefault();
                };
            grid_main.SetGridRowColumn(comboBox, 0, 1);

            ////////
            // new button
            Button button_new = new Button() { Padding = new Thickness(2.5), Margin = new Thickness(0.0, 0.0, 2.5, 0.0), FontWeight = FontWeights.Bold, Content = "+", };
            button_new.Click += (x, y) => { comboBox.SelectedItem = null; m_newFunc(); };
            grid_main.SetGridRowColumn(button_new, 0, 0);

            ////////
            // fin
            Content = grid_main;
        }

        #endregion


        #region Private Functionality

        private void ComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            ComboBox cb = sender as ComboBox;
            if (cb != null)
            {
                T selectedT = cb.SelectedItem as T;
                if (selectedT != null)
                    m_selectedFunc(selectedT);
            }
        }

        #endregion

        #endregion
    }
}