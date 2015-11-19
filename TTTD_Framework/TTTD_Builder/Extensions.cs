using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;


namespace TTTD_Builder
{
    public static class Extensions
    {
        public static void AddRange<T>(this ObservableCollection<T> observableCollection, IEnumerable<T> range)
        {
            foreach (var obj in range)
                observableCollection.Add(obj);
        }

        public static void SetGridRowColumn(this Grid grid, UIElement element, int row, int column)
        {
            Grid.SetRow(element, row);
            Grid.SetColumn(element, column);
            grid.Children.Add(element);
        }
    }
}
