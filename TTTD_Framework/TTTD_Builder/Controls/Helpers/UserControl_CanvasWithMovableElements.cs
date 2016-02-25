using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Shapes;


namespace TTTD_Builder.Controls.Helpers
{
    public class UserControl_CanvasWithMovableElements : UserControl
    {
        #region MEMBER FIELDS

        private enum ControlHitType
        {
            None,
            Body
        };

        private Canvas m_canvas;
        private ObservableCollection<FrameworkElement> m_elements = new ObservableCollection<FrameworkElement>();
        private ControlHitType m_hitType = ControlHitType.None;
        private bool m_dragInProgress = false;
        private Point m_lastPoint;

        #endregion


        #region MEMBER PROPERTIES

        public Canvas BackgroundCanvas
        {
            get { return m_canvas; }
        }

        public ObservableCollection<FrameworkElement> MovableElements
        {
            get { return m_elements; }
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

        public void AddMovableElement(FrameworkElement element, double top, double left)
        {
            element.MouseDown += Element_MouseDown;
            element.MouseUp += Element_MouseUp;
            element.MouseMove += Element_MouseMove;
            element.MouseLeave += Element_MouseLeave;

            m_canvas.Children.Add(element);

            Canvas.SetTop(element, top);
            Canvas.SetLeft(element, left);

            m_elements.Add(element);
        }

        public void RemoveMovableElement(FrameworkElement element)
        {
            element.MouseDown -= Element_MouseDown;
            element.MouseUp -= Element_MouseUp;
            element.MouseMove -= Element_MouseMove;
            element.MouseLeave -= Element_MouseLeave;

            m_canvas.Children.Remove(element);

            m_elements.Remove(element);
        }

        #endregion


        #region Private Functionality

        void Element_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            var element = sender as FrameworkElement;
            if (m_canvas.Children.Contains(element))
            {
                m_hitType = Canvas_GetHitType(element, Mouse.GetPosition(m_canvas));
                var desiredCursor = Canvas_GetMouseCursor(m_hitType);
                if (Cursor != desiredCursor)
                    Cursor = desiredCursor;

                if (m_hitType == ControlHitType.None)
                    return;

                m_lastPoint = Mouse.GetPosition(m_canvas);
                m_dragInProgress = true;
            }
        }

        private void Element_MouseUp(object sender, MouseButtonEventArgs e)
        {
            var element = sender as FrameworkElement;
            if (m_canvas.Children.Contains(element))
            {
                m_dragInProgress = false;
            }
        }

        private void Element_MouseMove(object sender, MouseEventArgs e)
        {
            var element = sender as FrameworkElement;
            if (m_canvas.Children.Contains(element))
            {
                if (m_dragInProgress)
                {
                    // See how much the mouse has moved
                    Point point = Mouse.GetPosition(m_canvas);
                    double offset_x = point.X - m_lastPoint.X;
                    double offset_y = point.Y - m_lastPoint.Y;

                    // Get the rectangle's current position
                    double new_x = Canvas.GetLeft(element);
                    double new_y = Canvas.GetTop(element);

                    // Update the rectangle
                    switch (m_hitType)
                    {
                        case ControlHitType.Body:
                            new_x += offset_x;
                            new_y += offset_y;
                            break;
                    }

                    Canvas.SetLeft(element, new_x);
                    Canvas.SetTop(element, new_y);

                    m_lastPoint = point;
                }
                else
                {
                    m_hitType = Canvas_GetHitType(element, Mouse.GetPosition(m_canvas));
                    var desiredCursor = Canvas_GetMouseCursor(m_hitType);
                    if (Cursor != desiredCursor)
                        Cursor = desiredCursor;
                }
            }
        }

        void Element_MouseLeave(object sender, MouseEventArgs e)
        {
            Cursor = Canvas_GetMouseCursor(ControlHitType.None);
        }

        private ControlHitType Canvas_GetHitType(FrameworkElement element, Point point)
        {
            double left = Canvas.GetLeft(element);
            double top = Canvas.GetTop(element);
            double right = left + element.Width;
            double bottom = top + element.Height;

            if (point.X < left || point.X > right || point.Y < top || point.Y > bottom)
                return ControlHitType.None;

            return ControlHitType.Body;
        }

        private Cursor Canvas_GetMouseCursor(ControlHitType hitType)
        {
            Cursor desiredCursor = Cursors.Arrow;
            switch (hitType)
            {
                case ControlHitType.None:
                    desiredCursor = Cursors.Arrow;
                    break;
                case ControlHitType.Body:
                    desiredCursor = Cursors.ScrollAll;
                    break;
            }

            return desiredCursor;
        }

        #endregion

        #endregion
    }
}
