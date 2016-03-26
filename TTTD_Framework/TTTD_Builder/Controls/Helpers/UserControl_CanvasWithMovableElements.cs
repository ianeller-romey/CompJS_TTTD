using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;


namespace TTTD_Builder.Controls.Helpers
{
    public class UserControl_CanvasWithMovableElements : UserControl, INotifyPropertyChanged
    {
        #region MEMBER FIELDS

        private Canvas m_canvas;
        private ObservableCollection<UserControl_MovableElement> m_elements = new ObservableCollection<UserControl_MovableElement>();
        private UserControl_MovableElement m_selectedElement;

        #endregion


        #region MEMBER PROPERTIES

        public Canvas BackgroundCanvas
        {
            get { return m_canvas; }
        }

        public ObservableCollection<UserControl_MovableElement> MovableElements
        {
            get { return m_elements; }
        }

        public UserControl_MovableElement SelectedElement
        {
            get { return m_selectedElement; }
            set
            {
                if (m_selectedElement != value)
                {
                    RaiseElementSelectedEvent(m_selectedElement, value);
                    m_selectedElement = value;
                    NotifyPropertyChanged("SelectedElement");
                }
            }
        }

        #endregion


        #region MEMBER EVENTS

        public event PropertyChangedEventHandler PropertyChanged;

        public static readonly RoutedEvent ElementSelectedEvent =
            EventManager.RegisterRoutedEvent("ElementSelected", RoutingStrategy.Bubble, typeof(SelectionChangedEventHandler), typeof(UserControl_CanvasWithMovableElements));
        public event SelectionChangedEventHandler ElementSelected
        {
            add { AddHandler(UserControl_CanvasWithMovableElements.ElementSelectedEvent, value); }
            remove { RemoveHandler(UserControl_CanvasWithMovableElements.ElementSelectedEvent, value); }
        }

        #endregion


        #region MEMBER CLASSES

        public class UserControl_MovableElement : UserControl, INotifyPropertyChanged
        {
            #region MEMBER FIELDS

            private static ObservableCollection<UserControl_MovableElement> s_selectedElements = new ObservableCollection<UserControl_MovableElement>();
            private static bool s_dragInProgress;
            private static Point s_lastPoint;

            private FrameworkElement m_element;

            private bool m_isSelected;
            private bool m_isCurrentSelected;

            #endregion


            #region MEMBER PROPERTIES

            public bool IsSelected
            {
                get { return m_isSelected; }
                set
                {
                    if (m_isSelected != value)
                    {
                        m_isSelected = value;
                        NotifyPropertyChanged("IsSelected");
                    }
                }
            }

            public bool IsCurrentSelected
            {
                get { return m_isCurrentSelected; }
                set
                {
                    if (m_isCurrentSelected != value)
                    {
                        m_isCurrentSelected = value;
                        NotifyPropertyChanged("IsCurrentSelected");
                    }
                }
            }

            #endregion


            #region MEMBER EVENTS

            public event PropertyChangedEventHandler PropertyChanged;

            public static readonly RoutedEvent ElementSelectedEvent =
                EventManager.RegisterRoutedEvent("ElementSelected", RoutingStrategy.Bubble, typeof(SelectionChangedEventHandler), typeof(UserControl_MovableElement));
            public event SelectionChangedEventHandler ElementSelected
            {
                add { AddHandler(UserControl_MovableElement.ElementSelectedEvent, value); }
                remove { RemoveHandler(UserControl_MovableElement.ElementSelectedEvent, value); }
            }

            #endregion


            #region MEMBER CLASSES

            public class RectangleFillConverter : IMultiValueConverter
            {
                #region MEMBER METHODS

                #region Public Functionality

                public object Convert(object[] values, Type targetType, object parameter, System.Globalization.CultureInfo culture)
                {
                    bool mouseOver = false;
                    bool isSelected = false;
                    bool isCurrentSelected = false;
                    try
                    {
                        mouseOver = (bool)values[0];
                        isSelected = (bool)values[1];
                        isCurrentSelected = (bool)values[2];
                    }
                    catch (Exception)
                    {
                    }

                    if (isCurrentSelected)
                        return new SolidColorBrush(Color.FromArgb(100, 0, 166, 16));
                    else if (isSelected)
                        return new RadialGradientBrush(Color.FromArgb(100, 0, 166, 16), Color.FromArgb(100, 191, 191, 191));
                    else if (mouseOver)
                        return new SolidColorBrush(Color.FromArgb(100, 191, 191, 191));
                    else
                        return Brushes.Transparent;
                }


                public object[] ConvertBack(object value, Type[] targetTypes, object parameter, System.Globalization.CultureInfo culture)
                {
                    throw new NotImplementedException();
                }

                #endregion

                #endregion
            }

            #endregion


            #region MEMBER METHODS

            #region Public Functionality

            public UserControl_MovableElement(FrameworkElement element)
            {
                m_element = element;

                CreateControls(m_element);

                MouseDown += Element_MouseDown;
                MouseUp += Element_MouseUp;
                MouseMove += Element_MouseMove;
                MouseLeave += Element_MouseLeave;
            }

            #endregion


            #region Private Functionality

            private static void MoveElement(UserControl_MovableElement movableElement, Vector offset)
            {
                double new_x = Canvas.GetLeft(movableElement);
                double new_y = Canvas.GetTop(movableElement);

                new_x += offset.X;
                new_y += offset.Y;

                Canvas.SetLeft(movableElement, new_x);
                Canvas.SetTop(movableElement, new_y);
            }

            private void CreateControls(FrameworkElement element)
            {
                Canvas canvas = new Canvas();

                Rectangle rectangle = new Rectangle();
                Binding binding_width = new Binding("ActualWidth") { Source = element, Mode = BindingMode.OneWay };
                Binding binding_height = new Binding("ActualHeight") { Source = element, Mode = BindingMode.OneWay };
                Binding binding_mouseOver =
                    new Binding()
                    {
                        RelativeSource = RelativeSource.Self,
                        Path = new PropertyPath(Rectangle.IsMouseOverProperty),
                        Mode = BindingMode.OneWay
                    };
                Binding binding_isSelected =
                    new Binding("IsSelected")
                    {
                        Source = this,
                        Mode = BindingMode.OneWay
                    };
                Binding binding_isCurrentSelected =
                    new Binding("IsCurrentSelected")
                    {
                        Source = this,
                        Mode = BindingMode.OneWay
                    };
                MultiBinding binding_rectangleFill = new MultiBinding() { Converter = new RectangleFillConverter() };
                binding_rectangleFill.Bindings.Add(binding_mouseOver);
                binding_rectangleFill.Bindings.Add(binding_isSelected);
                binding_rectangleFill.Bindings.Add(binding_isCurrentSelected);
                rectangle.SetBinding(Rectangle.FillProperty, binding_rectangleFill);
                rectangle.SetBinding(Rectangle.WidthProperty, binding_width);
                rectangle.SetBinding(Rectangle.HeightProperty, binding_height);

                canvas.Children.Add(element);
                Canvas.SetTop(element, 0);
                Canvas.SetLeft(element, 0);
                canvas.Children.Add(rectangle);
                Canvas.SetTop(rectangle, 0);
                Canvas.SetLeft(rectangle, 0);

                Content = canvas;
            }

            private void Element_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
            {
                var x = sender as UserControl_MovableElement;
                if (x != null && x == this)
                {
                    if (e.LeftButton == MouseButtonState.Pressed)
                    {
                        if (!IsSelected)
                        {
                            s_selectedElements.Add(this);
                            IsSelected = true;
                        }
                            
                        foreach (var y in s_selectedElements)
                            y.IsCurrentSelected = y == this;

                        RaiseElementSelectedEvent();

                        s_lastPoint = Mouse.GetPosition(x.Parent as Canvas);
                        s_dragInProgress = true;
                        Cursor = Cursors.ScrollAll;
                    }
                    else if (e.RightButton == MouseButtonState.Pressed)
                    {
                        if (IsSelected)
                        {
                            s_selectedElements.Remove(this);
                            IsSelected = false;

                            if (IsCurrentSelected)
                                IsCurrentSelected = false;

                            RaiseElementSelectedEvent();
                        }
                    }
                }
            }

            private void Element_MouseUp(object sender, MouseButtonEventArgs e)
            {
                var x = sender as UserControl_MovableElement;
                if (x != null && x == this)
                {
                    s_dragInProgress = false;
                    Cursor = Cursors.Arrow;
                }
            }

            private void Element_MouseMove(object sender, MouseEventArgs e)
            {
                var x = sender as UserControl_MovableElement;
                if (x != null && x == this)
                {
                    if (s_dragInProgress)
                    {
                        Point point = Mouse.GetPosition(this.Parent as Canvas);
                        Vector offset = point - s_lastPoint;

                        foreach (var element in s_selectedElements)
                            MoveElement(element, offset);

                        s_lastPoint = point;
                    }
                }
            }

            private void Element_MouseLeave(object sender, MouseEventArgs e)
            {
                var x = sender as UserControl_MovableElement;
                if (x != null && x == this)
                {
                    s_dragInProgress = false;
                    Cursor = Cursors.Arrow;
                }
            }

            private void NotifyPropertyChanged(string name)
            {
                if (PropertyChanged != null && !string.IsNullOrEmpty(name))
                    PropertyChanged(this, new PropertyChangedEventArgs(name));
            }

            private void RaiseElementSelectedEvent()
            {
                var args = new SelectionChangedEventArgs(UserControl_MovableElement.ElementSelectedEvent, new Collection<UserControl_MovableElement>(), new Collection<UserControl_MovableElement>(new [] { this }));
                RaiseEvent(args);
            }

            #endregion

            #endregion
        }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_CanvasWithMovableElements()
        {
            m_canvas = new Canvas() { Background = Brushes.Gray };
            Content = m_canvas;
        }

        public void Clear()
        {
            foreach (var e in m_elements.ToList())
                RemoveMovableElement(e);
        }

        public UserControl_MovableElement AddMovableElement(FrameworkElement element)
        {
            var movableElement = new UserControl_MovableElement(element);
            movableElement.ElementSelected += MovableElement_ElementSelected;
            m_canvas.Children.Add(movableElement);

            Canvas.SetTop(movableElement, 0);
            Canvas.SetLeft(movableElement, 0);

            m_elements.Add(movableElement);

            return movableElement;
        }

        public UserControl_MovableElement AddMovableElement(FrameworkElement element, double top, double left)
        {
            var movableElement = new UserControl_MovableElement(element);
            movableElement.ElementSelected += MovableElement_ElementSelected;
            m_canvas.Children.Add(movableElement);

            Canvas.SetTop(movableElement, top);
            Canvas.SetLeft(movableElement, left);

            m_elements.Add(movableElement);

            return movableElement;
        }

        public void RemoveMovableElement(UserControl_MovableElement movableElement)
        {
            m_canvas.Children.Remove(movableElement);

            m_elements.Remove(movableElement);
        }

        #endregion


        #region Private Functionality

        private void MovableElement_ElementSelected(object sender, SelectionChangedEventArgs e)
        {
            var c = sender as UserControl_MovableElement;
            SelectedElement = (c != null && c.IsSelected) ? c : null;
        }

        private void NotifyPropertyChanged(string name)
        {
            if (PropertyChanged != null && !string.IsNullOrEmpty(name))
                PropertyChanged(this, new PropertyChangedEventArgs(name));
        }

        private void RaiseElementSelectedEvent(UserControl_MovableElement oldElement, UserControl_MovableElement newElement)
        {
            var args = 
                new SelectionChangedEventArgs
                (
                    UserControl_CanvasWithMovableElements.ElementSelectedEvent,
                    (oldElement != null)
                    ? new Collection<UserControl_MovableElement>(new[] { oldElement })
                    : new Collection<UserControl_MovableElement>(), 
                    new Collection<UserControl_MovableElement>(new[] { newElement })
                );
            RaiseEvent(args);
        }

        #endregion

        #endregion
    }
}
