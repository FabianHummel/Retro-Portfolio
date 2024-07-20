use bevy::asset::embedded_asset;
use bevy::prelude::*;
use bevy::render::render_resource::{AsBindGroup, ShaderRef};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn start(){
    App::new()
        .add_plugins(DefaultPlugins
            .set(WindowPlugin {
                primary_window: Some(Window {
                    canvas: Some("#pixel-globe".to_string()),
                    fit_canvas_to_parent: true,
                    ..default()
                }),
                ..default()
            })
            .build()
            .disable::<bevy::log::LogPlugin>())
        .add_plugins(MaterialPlugin::<GlobeMaterial>::default())
        .add_plugins(EmbeddedAssetPlugin)
        .add_systems(Startup, setup_scene)
        .add_systems(Update, rotate_globe)
        .run();
}

struct EmbeddedAssetPlugin;

impl Plugin for EmbeddedAssetPlugin {
    fn build(&self, app: &mut App) {
        // We get to choose some prefix relative to the workspace root which
        // will be ignored in "embedded://" asset paths.
        let omit_prefix = "src";
        // Path to asset must be relative to this file, because that's how
        // include_bytes! works.
        embedded_asset!(app, omit_prefix, "shaders/globe.wgsl");
    }
}

fn create_globe_mesh(
    meshes: &mut Assets<Mesh>
) -> Handle<Mesh> {
    let mut sphere_mesh = Sphere::new(1.0)
        .mesh()
        .build();
    sphere_mesh
        .generate_tangents()
        .expect("Failed to generate tangents");
    meshes.add(sphere_mesh)
}

#[derive(Component)]
struct Globe {
    rotation_speed: f32,
}

#[derive(Asset, TypePath, AsBindGroup, Debug, Clone)]
struct GlobeMaterial {
    
}

impl Material for GlobeMaterial {
    fn fragment_shader() -> ShaderRef {
        "embedded://pixel-globe/shaders/globe.wgsl".into()
    }
}

fn setup_scene(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<GlobeMaterial>>,
) {
    commands.spawn(MaterialMeshBundle {
        mesh: create_globe_mesh(&mut meshes),
        material: materials.add(GlobeMaterial {
        }),
        ..Default::default()
    }).insert(Globe {
        rotation_speed: 1.0,
    });

    commands.spawn(Camera3dBundle {
        transform: Transform::from_xyz(0.0, 0.0, 3.0).looking_at(Vec3::ZERO, Vec3::Y),
        camera: Camera {
            clear_color: ClearColorConfig::Custom(Srgba::new(0.0, 0.0, 0.0, 0.0).into()),
            ..Default::default()
        },
        ..default()
    });
}

fn rotate_globe(
    time: Res<Time>,
    mut query: Query<(&Globe, &mut Transform)>,
) {
    for (globe, mut transform) in query.iter_mut() {
        transform.rotation *= Quat::from_rotation_y(globe.rotation_speed * time.delta_seconds());
    }
}