using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

using Xceed.Wpf.Toolkit;

using TTTD_Builder.Controls.Helpers;
using TTTD_Builder.Controls.Validation;
using TTTD_Builder.Managers;
using TTTD_Builder.Model.Data;


namespace TTTD_Builder.EditData
{
    public class UserControl_LevelEditor : UserControl_EditData
    {
        #region MEMBER FIELDS

        private Level m_level;
        private ObservableCollection<LevelLayout> m_levelLayouts = new ObservableCollection<LevelLayout>();

        private Grid m_grid_main;
        private ComboBox m_comboBox_EntityInstanceDefinitions;
        private Button m_button_entityInstanceDefinition;
        private ScrollViewer m_viewer;
        private UserControl_CanvasWithMovableElements m_canvas;
        private Expander m_expander_selectedLevelLayoutDataEditor;

        private const int c_temporaryId = -1;
        private const double c_noAnimationFrameSize = 32.0;

        #endregion


        #region MEMBER PROPERTIES
        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public UserControl_LevelEditor(Level level) :
            base("Level Layout", false)
        {
            m_level = level;

            if (DataIsNull())
            {
                throw new ArgumentNullException("level");
            }
            else
            {
                Binding binding_canvas_width =
                    new Binding("Width")
                    {
                        Source = m_level,
                        Mode = BindingMode.OneWay
                    };
                m_canvas.BackgroundCanvas.SetBinding(Canvas.WidthProperty, binding_canvas_width);
                Binding binding_canvas_height =
                    new Binding("Height")
                    {
                        Source = m_level,
                        Mode = BindingMode.OneWay
                    };
                m_canvas.BackgroundCanvas.SetBinding(Canvas.HeightProperty, binding_canvas_height);

                ResetLevelLayoutList();
                foreach (var l in m_levelLayouts)
                    CreateLevelLayoutControl(l);
                AddPlayerLevelLayoutControl();
            }
        }

        #endregion


        #region Private Functionality

        protected override void SetThisContent()
        {
            m_grid_main = new Grid();
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = new GridLength(100.0, GridUnitType.Star) });
            m_grid_main.RowDefinitions.Add(new RowDefinition() { Height = GridLength.Auto });

            ////////
            // ComboBox (Entity Instance Definition)
            var collectionViewSource_EntityInstanceDefintion = new CollectionViewSource() { Source = DataManager.EntityInstanceDefinitions };
            m_comboBox_EntityInstanceDefinitions =
                new ComboBox()
                {
                    DisplayMemberPath = "Name",
                    IsTextSearchEnabled = true
                };
            m_comboBox_EntityInstanceDefinitions.SetBinding(ItemsControl.ItemsSourceProperty, new Binding { Source = collectionViewSource_EntityInstanceDefintion });
            Label label_entityInstanceDefinition = new Label() { Content = "Entity Instance Definition: ", FontWeight = FontWeights.Bold, VerticalAlignment = VerticalAlignment.Center };
            m_button_entityInstanceDefinition = new Button() { Content = "Add" };
            m_button_entityInstanceDefinition.Click += Button_EntityInstanceDefinition_Click;
            Grid grid_entityInstanceDefinition = new Grid();
            grid_entityInstanceDefinition.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_entityInstanceDefinition.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_entityInstanceDefinition.ColumnDefinitions.Add(new ColumnDefinition() { Width = GridLength.Auto });
            grid_entityInstanceDefinition.SetRowColumn(m_button_entityInstanceDefinition, 0, 2);
            grid_entityInstanceDefinition.SetRowColumn(m_comboBox_EntityInstanceDefinitions, 0, 1);
            grid_entityInstanceDefinition.SetRowColumn(label_entityInstanceDefinition, 0, 0);
            m_grid_main.SetRowColumn(grid_entityInstanceDefinition, 0, 0);

            ////////
            // Canvas
            m_canvas = new UserControl_CanvasWithMovableElements();
            m_canvas.ElementSelected += Canvas_ElementSelected;
            m_viewer =
                new ScrollViewer()
                {
                    VerticalScrollBarVisibility = ScrollBarVisibility.Visible,
                    HorizontalScrollBarVisibility = ScrollBarVisibility.Visible,
                    Content = m_canvas
                };
            m_grid_main.SetRowColumn(m_viewer, 1, 0);

            ////////
            // FIN
            ThisContent = new ActivatableContent() { Content = m_grid_main, FirstFocus = m_comboBox_EntityInstanceDefinitions };
        }

        protected override bool DataIsNull()
        {
            return m_level == null;
        }

        protected override int AddNewData()
        {
            SaveData();
            return m_level.Id;
        }

        protected override int UpdateExistingData()
        {
            SaveData();
            return m_level.Id;
        }

        protected override void RevertNewData()
        {
            m_canvas.Clear();
            ResetLevelLayoutList();
            foreach (var l in m_levelLayouts)
                CreateLevelLayoutControl(l);
            AddPlayerLevelLayoutControl();
        }

        protected override void RevertExistingData()
        {
            m_canvas.Clear();
            ResetLevelLayoutList();
            foreach (var l in m_levelLayouts)
                CreateLevelLayoutControl(l);
            AddPlayerLevelLayoutControl();
        }

        private void ResetLevelLayoutList()
        {
            m_levelLayouts.Clear();
            foreach(var x in DataManager.LevelLayouts.Where(x => x.Level == m_level))
            {
                // clone the LevelLayout object so that we don't accidentally save the changes if we cancel
                m_levelLayouts.Add
                (
                    new LevelLayout()
                    {
                        Id = x.Id,
                        Name = (x.Name != null) ? new string(x.Name.ToCharArray()) : null,
                        Level = x.Level,
                        EntityInstanceDefinition = x.EntityInstanceDefinition,
                        Priority = x.Priority,
                        Data = x.Data,
                        X = x.X,
                        Y = x.Y
                    }
                );
            }
        }

        private void SaveData()
        {
            // update all the preexisting LevelLayout objects
            foreach (var temp in m_levelLayouts.Where(x => x.Id > c_temporaryId && !x.EntityInstanceDefinition.IsPlayerEntityInstanceDefinition()))
            {
                var levelLayout = DataManager.LevelLayouts.FirstOrDefault(x => x.Id == temp.Id);
                if (levelLayout != null)
                {
                    levelLayout.Name = temp.Name;
                    levelLayout.Level = temp.Level;
                    levelLayout.EntityInstanceDefinition = temp.EntityInstanceDefinition;
                    levelLayout.Priority = temp.Priority;
                    levelLayout.Data = temp.Data;
                    levelLayout.X = temp.X;
                    levelLayout.Y = temp.Y;
                }
            }
            // add any new LevelLayout objects
            foreach (var temp in m_levelLayouts.Where(x => x.Id == c_temporaryId && !x.EntityInstanceDefinition.IsPlayerEntityInstanceDefinition()))
            {
                var levelLayout = DataManager.Generate<LevelLayout>();
                levelLayout.Name = temp.Name;
                levelLayout.Level = temp.Level;
                levelLayout.EntityInstanceDefinition = temp.EntityInstanceDefinition;
                levelLayout.Priority = temp.Priority;
                levelLayout.Data = temp.Data;
                levelLayout.X = temp.X;
                levelLayout.Y = temp.Y;

                DataManager.LevelLayouts.Add(levelLayout);
            }
            var playerLevelLayout = m_levelLayouts.FirstOrDefault(x => x.EntityInstanceDefinition.IsPlayerEntityInstanceDefinition());
            m_level.PlayerPosition = (playerLevelLayout != null) ? new Nullable<Point>(new Point(playerLevelLayout.X, playerLevelLayout.Y)) : null;
        }

        private void AddPlayerLevelLayoutControl()
        {
            if (m_level.PlayerPosition.HasValue)
            {
                var playerEntityInstanceDefinition = DataManager.EntityInstanceDefinitions.FirstOrDefault(x => x.IsPlayerEntityInstanceDefinition());
                if (playerEntityInstanceDefinition != null)
                    CreateLevelLayoutControl(AddTemporaryLevelLayout(playerEntityInstanceDefinition, m_level.PlayerPosition.Value.X, m_level.PlayerPosition.Value.Y));
            }
        }

        private LevelLayout AddTemporaryLevelLayout(EntityInstanceDefinition entityInstanceDefinition, double x, double y)
        {
            var levelLayout =
                new LevelLayout()
                {
                    Id = c_temporaryId,
                    EntityInstanceDefinition = entityInstanceDefinition,
                    Level = m_level,
                    Priority = 0,
                    X = x,
                    Y = y
                };
            m_levelLayouts.Add(levelLayout);
            return levelLayout;
        }

        private void CreateLevelLayoutControl(LevelLayout levelLayout)
        {
            var animationFrame = levelLayout.EntityInstanceDefinition.GetFirstAnimationFrameDefinition();
            FrameworkElement levelLayoutControl = 
                (animationFrame != null) 
                ? CreateLevelLayoutControlWithAnimationFrame(animationFrame) 
                : CreateLevelLayoutControlWithoutAnimationFrame();

            var y = levelLayout.Y;
            var x = levelLayout.X;

            var movableLevelLayoutControl = m_canvas.AddMovableElement(levelLayoutControl, y, x);
            movableLevelLayoutControl.Tag = levelLayout;

            Binding binding_y =
                new Binding("Y")
                {
                    Source = levelLayout,
                    Mode = BindingMode.TwoWay
                };
            movableLevelLayoutControl.SetBinding(Canvas.TopProperty, binding_y);

            Binding binding_x =
                new Binding("X")
                {
                    Source = levelLayout,
                    Mode = BindingMode.TwoWay
                };
            movableLevelLayoutControl.SetBinding(Canvas.LeftProperty, binding_x);
        }

        private FrameworkElement CreateLevelLayoutControlWithAnimationFrame(AnimationFrameDefinition animationFrame)
        {
            var image = new Image();
            image.Source = 
                Extensions.BitmapSourceFromTextureCoords
                (
                    animationFrame.Texture, 
                    animationFrame.TexCoordTop, 
                    animationFrame.TexCoordRight, 
                    animationFrame.TexCoordBottom, 
                    animationFrame.TexCoordLeft, 
                    animationFrame.Width, 
                    animationFrame.Height
                );
            return image;
        }

        private FrameworkElement CreateLevelLayoutControlWithoutAnimationFrame()
        {
            var control =
                new Rectangle()
                {
                    Fill = new SolidColorBrush(Brushes.WhiteSmoke.Color) { Opacity = 0.25 },
                    Stroke = Brushes.Black,
                    StrokeThickness = 1.0,
                    Width = c_noAnimationFrameSize,
                    Height = c_noAnimationFrameSize
                };
            return control;
        }

        private void Button_EntityInstanceDefinition_Click(object sender, RoutedEventArgs e)
        {
            var button = sender as Button;
            if (button != null && button == m_button_entityInstanceDefinition)
            {
                var eid = m_comboBox_EntityInstanceDefinitions.SelectedItem as EntityInstanceDefinition;
                if (eid != null)
                {
                    var levelLayout = AddTemporaryLevelLayout(eid, m_viewer.HorizontalOffset, m_viewer.VerticalOffset);
                    CreateLevelLayoutControl(levelLayout);
                }
            }
        }

        void Canvas_ElementSelected(object sender, SelectionChangedEventArgs e)
        {
            var canvas = sender as UserControl_CanvasWithMovableElements;
            if (canvas != null && canvas == m_canvas)
            {
                if (m_expander_selectedLevelLayoutDataEditor != null)
                    m_grid_main.Children.Remove(m_expander_selectedLevelLayoutDataEditor);

                if (e.AddedItems.Count > 0)
                {
                    var control = e.AddedItems.OfType<UserControl_CanvasWithMovableElements.UserControl_MovableElement>().FirstOrDefault();
                    if (control != null && control.IsCurrentSelected)
                    {
                        var levelLayout = control.Tag as LevelLayout;
                        if (levelLayout != null)
                        {
                            m_expander_selectedLevelLayoutDataEditor =
                                new Expander()
                                {
                                    ExpandDirection = ExpandDirection.Up,
                                    IsExpanded = true,
                                    Content = new UserControl_LevelLayoutDataEditor(levelLayout)
                                };
                            m_grid_main.SetRowColumn(m_expander_selectedLevelLayoutDataEditor, 2, 0);
                        }
                    }
                }
            }
        }

        #endregion

        #endregion
    }
}
