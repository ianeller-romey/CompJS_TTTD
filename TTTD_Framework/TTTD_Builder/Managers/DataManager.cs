using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using TTTD_Builder.Lib;
using Data = TTTD_Builder.Lib.Data;


namespace TTTD_Builder.Managers
{
    public static class DataManager
    {
        #region MEMBER FIELDS

        private static ObservableCollection<Data.AnimationFrameDefinition> s_animationFrameDefinitions = new ObservableCollection<Data.AnimationFrameDefinition>();
        private static ObservableCollection<Data.AnimationStateDefinition> s_animationStateDefinitions = new ObservableCollection<Data.AnimationStateDefinition>();
        private static ObservableCollection<Data.Audio> s_audio = new ObservableCollection<Data.Audio>();
        private static ObservableCollection<Data.AudioType> s_audioTypes = new ObservableCollection<Data.AudioType>();
        private static ObservableCollection<Data.BehaviorInstanceDefinition> s_behaviorInstanceDefinitions = new ObservableCollection<Data.BehaviorInstanceDefinition>();
        private static ObservableCollection<Data.CollisionType> s_collisionTypes = new ObservableCollection<Data.CollisionType>();
        private static ObservableCollection<Data.EntityInstanceDefinition> s_entityInstanceDefinitions = new ObservableCollection<Data.EntityInstanceDefinition>();
        private static ObservableCollection<Data.FontTextureDefinition> s_fontTextureDefinition = new ObservableCollection<Data.FontTextureDefinition>();
        private static ObservableCollection<Data.GraphicsInstanceDefinition> s_graphicsInstanceDefinition = new ObservableCollection<Data.GraphicsInstanceDefinition>();
        private static ObservableCollection<Data.Level> s_levels = new ObservableCollection<Data.Level>();
        private static ObservableCollection<Data.LevelLayout> s_levelLayouts = new ObservableCollection<Data.LevelLayout>();
        private static ObservableCollection<Data.PhysicsInstanceDefinition> s_physicsInstanceDefinitions = new ObservableCollection<Data.PhysicsInstanceDefinition>();
        private static ObservableCollection<Data.PhysType> s_physTypes = new ObservableCollection<Data.PhysType>();
        private static ObservableCollection<Data.Shader> s_shaders = new ObservableCollection<Data.Shader>();

        private static Dictionary<Type, int> s_idGenerator = new Dictionary<Type, int>
        {
            { typeof(Data.AnimationFrameDefinition), 0 },
            { typeof(Data.AnimationStateDefinition), 0 },
            { typeof(Data.Audio), 0 },
            { typeof(Data.AudioType), 0 },
            { typeof(Data.BehaviorInstanceDefinition), 0 },
            { typeof(Data.CollisionType), 0 },
            { typeof(Data.EntityInstanceDefinition), 0 },
            { typeof(Data.FontTextureDefinition), 0 },
            { typeof(Data.GraphicsInstanceDefinition), 0 },
            { typeof(Data.Level), 0 },
            { typeof(Data.LevelLayout), 0 },
            { typeof(Data.PhysicsInstanceDefinition), 0 },
            { typeof(Data.PhysType), 0 },
            { typeof(Data.Shader), 0 }
        };

        #endregion


        #region MEMBER PROPERTIES

        public static ObservableCollection<Data.AnimationFrameDefinition> AnimationFrameDefinitions { get { return s_animationFrameDefinitions; } }
        public static ObservableCollection<Data.AnimationStateDefinition> AnimationStateDefinitions { get { return s_animationStateDefinitions; } }
        public static ObservableCollection<Data.Audio> Audios { get { return s_audio; } }
        public static ObservableCollection<Data.AudioType> AudioTypes { get { return s_audioTypes; } }
        public static ObservableCollection<Data.BehaviorInstanceDefinition> BehaviorInstanceDefinitions { get { return s_behaviorInstanceDefinitions; } }
        public static ObservableCollection<Data.CollisionType> CollisionTypes { get { return s_collisionTypes; } }
        public static ObservableCollection<Data.EntityInstanceDefinition> EntityInstanceDefinitions { get { return s_entityInstanceDefinitions; } }
        public static ObservableCollection<Data.FontTextureDefinition> FontTextureDefinitions { get { return s_fontTextureDefinition; } }
        public static ObservableCollection<Data.GraphicsInstanceDefinition> GraphicsInstanceDefinitions { get { return s_graphicsInstanceDefinition; } }
        public static ObservableCollection<Data.Level> Levels { get { return s_levels; } }
        public static ObservableCollection<Data.LevelLayout> LevelLayouts { get { return s_levelLayouts; } }
        public static ObservableCollection<Data.PhysicsInstanceDefinition> PhysicsInstanceDefinitions { get { return s_physicsInstanceDefinitions; } }
        public static ObservableCollection<Data.PhysType> PhysTypes { get { return s_physTypes; } }
        public static ObservableCollection<Data.Shader> Shaders { get { return s_shaders; } }

        #endregion


        #region MEMBER METHODS

        #region Public Functionality

        public static void Load()
        {
            ReaderWriterManager.CreateDataStoreSelector();

            LoadType<Data.AnimationFrameDefinition>(s_animationFrameDefinitions);
            LoadType<Data.AnimationStateDefinition>(s_animationStateDefinitions);
            LoadType<Data.Audio>(s_audio);
            LoadType<Data.AudioType>(s_audioTypes);
            LoadType<Data.BehaviorInstanceDefinition>(s_behaviorInstanceDefinitions);
            LoadType<Data.CollisionType>(s_collisionTypes);
            LoadType<Data.EntityInstanceDefinition>(s_entityInstanceDefinitions);
            LoadType<Data.FontTextureDefinition>(s_fontTextureDefinition);
            LoadType<Data.GraphicsInstanceDefinition>(s_graphicsInstanceDefinition);
            LoadType<Data.Level>(s_levels);
            LoadType<Data.LevelLayout>(s_levelLayouts);
            LoadType<Data.PhysicsInstanceDefinition>(s_physicsInstanceDefinitions);
            LoadType<Data.PhysType>(s_physTypes);
            LoadType<Data.Shader>(s_shaders);
        }

        public static void Save()
        {
            ReaderWriterManager.CreateDataStoreSelector();

            SaveType<Data.AnimationFrameDefinition>(s_animationFrameDefinitions);
            SaveType<Data.AnimationStateDefinition>(s_animationStateDefinitions);
            SaveType<Data.Audio>(s_audio);
            SaveType<Data.AudioType>(s_audioTypes);
            SaveType<Data.BehaviorInstanceDefinition>(s_behaviorInstanceDefinitions);
            SaveType<Data.CollisionType>(s_collisionTypes);
            SaveType<Data.EntityInstanceDefinition>(s_entityInstanceDefinitions);
            SaveType<Data.FontTextureDefinition>(s_fontTextureDefinition);
            SaveType<Data.GraphicsInstanceDefinition>(s_graphicsInstanceDefinition);
            SaveType<Data.Level>(s_levels);
            SaveType<Data.LevelLayout>(s_levelLayouts);
            SaveType<Data.PhysicsInstanceDefinition>(s_physicsInstanceDefinitions);
            SaveType<Data.PhysType>(s_physTypes);
            SaveType<Data.Shader>(s_shaders);
        }

        public static int GenerateId<T>()
        {
            return s_idGenerator[typeof(T)]++;
        }

        #endregion


        #region Private Functionality

        private static void LoadType<T>(ObservableCollection<T> collection) where T : Data.IHasId
        {
            var read = ReaderWriterManager.Read<T>();
            if (read != null)
            {
                collection.Clear();
                collection.AddRange<T>(read);

                s_idGenerator[typeof(T)] = collection.Max(x => x.Id) + 1;
            }
        }

        private static void SaveType<T>(ObservableCollection<T> collection)
        {
            ReaderWriterManager.Write<T>(collection);
        }

        #endregion

        #endregion

    }
}
