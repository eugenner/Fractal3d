import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);


camera.position.z = 15;
camera.position.y = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);
controls.target.set(0, 0, 0);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

controls.screenSpacePanning = false;

controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.maxPolarAngle = Math.PI;


const geometry = new THREE.BoxGeometry(0.125, 0.125, 0.125);
const material = new THREE.MeshBasicMaterial({ color: 0x00af00 });
const materialRed = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
const cube = new THREE.Mesh(geometry, materialRed);
scene.add(cube);
// cube.rotation.x += 2;
cube.position.x = 0;
cube.position.y = 0;
cube.position.z = 0;





/*
const v1 = new THREE.Vector3(0,0,1);
const v2 = new THREE.Vector3(0.7071067811865475,0,0.7071067811865475);
console.log('test: ' + JSON.stringify(pa.crossVectors(v1, v2)));

Идея:

1. Два треугольника (координаты их вершин), для удобства, треугольники прямые
2. Получаю вектора перпендикуляров к векторам треугольников
3. Совмещаю первый треугольник со вторым (начальная точка)
4. Получаю матрицу поворота, для совмещения перпендикуляров (перевожу треугольники в одну плоскость)
    координаты обоих треугольников пересчитываются матрицей поворота, получаю новый набор точек
5. Поворачиваю 1-й треугольник (вокруг перпендикуляра) до совпадения одного из векторов, при этом также 
    пересчитываются все точки (двух треугольников)
6. Расчитываю новую длину для нового треугольника, и второй (можно единичный? вектор).


Переделать, создать функцию, на входе пара треугольников, на выходе, новая пара.
Проверить: новая пара должна дать корректную следующую пару.



The Routine in short:

1. Scale
    scale all branches (presented by triangles) 
    by base[1] and every branch[1] (forward vectors length proportion)
2. Align vectors
    align new scaled brances with scaled bases to every branch forward vector
3. Align planes (Rotate around Forward)
    rotate aligned branches around it's forward vectors to make them in parallel with 
    original branches forward vectors
4. Move
    move rotated branches in original brandches forward vector ends
5. Recursion
    repeat all the same with generated branches till selected level
*/

/////////////// Start


var base = [
    new THREE.Vector3(0, 0, 0), // [0] - center of triangle
    new THREE.Vector3(0, 1, 0), // forward vector
    new THREE.Vector3(1, 0, 0), // right vector
    new THREE.Vector3(0, 0, 0)]; // close triangle


// relative coordinates
var branches = [
    // cool tree
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0.3, -0.3, 0), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],      
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0.6, 0), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(-0.3, -0.3, 0), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],   
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, -0.2, 0.2), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, -0.2, -0.2), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    

 
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(0.3, 0.8, 0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(0.3, 0.8, -0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(-0.3, 0.8, 0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(-0.3, 0.8, -0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
   

];

var branches2 = [
    // cool tree
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0.5, 0.2), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0, 0.5, -0.2), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(0.4, 0.9, 0.3), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    [
        new THREE.Vector3(0, 0, 0), 
        new THREE.Vector3(-0.4, 0.5, 0), // Y - forward vector 
        new THREE.Vector3(0.5, 0, 0), // X - right vector
        new THREE.Vector3(0, 0, 0)
    ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(0.3, 0.8, 0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(0.3, 0.8, -0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(-0.3, 0.8, 0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
    // [
    //     new THREE.Vector3(0, 0, 0), 
    //     new THREE.Vector3(-0.3, 0.8, -0.2), // Y - forward vector 
    //     new THREE.Vector3(0.5, 0, 0.5), // X - right vector
    //     new THREE.Vector3(0, 0, 0)
    // ],    
   

];

// recalc to absolute coordinates
var absBranches = [];
branches.forEach((br) => {
    br.forEach((brPoint) => {
        brPoint.add(base[1]);
    });
    console.log('branch abs: ' + JSON.stringify(br));
    absBranches.push(br);
});

drawFractal(base, absBranches, 1)



renderer.render(scene, camera);
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

//////////////// functions

// base - начальный треугольник, четыре вершины, замкнут
// branches - массив треугольников созданных пользователем
// level - уровень во фрактальном дереве
function drawFractal(base, branches, level) {
    if (level > 5)
        return;
    drawLine(base, 'blue');
    branches.forEach((b) => {
        drawLine(b, 'blue')
    });
    
    console.log('base: ' + JSON.stringify(base));


    // 1. Scale with base
    var scaledBranchesWithBase = scaleBranches(base, branches);
    console.log('scaledBranchesWithBase: ' + JSON.stringify(scaledBranchesWithBase));

    var colorKeys = Object.keys(THREE.Color.NAMES);
    // scaledBranchesWithBase.forEach((b) => {
    //     var l = b.length;
    //     console.log('len: ' + l);
    //     for(var i = 0; i < l; i++) {
    //         drawLine(b[i], colorKeys[30 + i]); // new scaled base
    //     }
    // });


    // 2. Align by forward axis
    var alignedForwardBranches = alignForwardBranches(scaledBranchesWithBase); // function will change source data, no needs to return
    // alignedForwardBranches.forEach((b) => {
    //     var l = b.length;
    //     console.log('len: ' + l);
    //     for(var i = 1; i < l; i++) {
    //         drawLine(b[i], 'green'); // new scaled base
    //     }
    // });

    var alignedPlaneBranches = alignPlaneBranches(alignedForwardBranches);
    // alignedPlaneBranches.forEach((b) => {
    //     var l = b.length;
    //     console.log('len: ' + l);
    //     for(var i = 1; i < l; i++) {
    //         drawLine(b[i], 'red'); // new scaled base
    //     }
    //     // drawLine(b[0], "green"); 
    // });

    var positioned = moveInPosition(alignedPlaneBranches);
    positioned.forEach((b) => {
        var l = b.length;
        console.log('len: ' + l);
        for(var i = 1; i < l; i++) {
            drawLine(b[i], 'white'); // new scaled base
        }
        // drawLine(b[0], "green"); 
    });

    positioned.forEach((p) => {
        drawFractal(p[0], p.splice(1), level + 1);
    });
}

function moveInPosition(data) {
    var result = [];
    data.forEach((branchData) => {
        var branch = branchData[0];
        var newBase = branchData[1];
        var deltaVector = branch[1].clone().sub(newBase[1]);

        var newBranches = branchData.splice(2); // take only new scaled branches
        newBranches.forEach((nb) => {
            nb.forEach((point) => {
                point.add(deltaVector);
            })
        });
        result.push([branch,  ...newBranches]);
    });
    return result;
}


// rotate around newBase's forward vector to make planes of branch and scaled branch parallel
function alignPlaneBranches(data) {
    // получить два перпендикуляра 
    // получить угол между ними
    // довернуть scaled branch вокруг forward на этот угол
    var result = [];
    data.forEach((branchData) => {
        var branch = branchData[0];
        var newBase = branchData[1];

        var branchPerp = getTrPerp(branch);
        var newBasePerp = getTrPerp(newBase);

        var alignAngle = branchPerp.angleTo(newBasePerp);
        const pa = newBase[0].clone(); // TODO какую точку использовать для оси поворота? 
        const perpsAxis = pa.crossVectors(branchPerp, newBasePerp).normalize();
        const qRotation = new THREE.Quaternion();
        qRotation.setFromAxisAngle(perpsAxis, -alignAngle);
        const alignMatrix = new THREE.Matrix4();
        alignMatrix.makeRotationFromQuaternion(qRotation);

        newBase.forEach((point) => {
            point.applyMatrix4(alignMatrix);
        })

        var newBranches = branchData.splice(2); // take only new scaled branches
        newBranches.forEach((nb) => {
            nb.forEach((point) => {
                point.applyMatrix4(alignMatrix);
            })
        });
        result.push([branch, newBase, ...newBranches]);
    });
    return result;

}

// [ [branch (previous), newBase (scaled), b1 (scaled), b2 (scaled), ...] ... ]
// align couples of [newBase,b1], [newBase:b2] relative branch forward axis
function alignForwardBranches(data) {
    var result = [];
    data.forEach((branchData) => {
        var branch = branchData[0];
        var newBase = branchData[1];


        var branchForwardAxis = branch[1].clone().sub(branch[0]);
        var newBaseForwardAxis = newBase[1].clone().sub(newBase[0]);

        var alignAngle = branchForwardAxis.angleTo(newBaseForwardAxis);
        
        const pa = newBase[1].clone(); // TODO какую точку использовать для оси поворота? 
        const perpsAxis = pa.crossVectors(branchForwardAxis, newBaseForwardAxis).normalize();
        const qRotation = new THREE.Quaternion();
        qRotation.setFromAxisAngle(perpsAxis, -alignAngle);
        const alignMatrix = new THREE.Matrix4();
        alignMatrix.makeRotationFromQuaternion(qRotation);

        newBase.forEach((point) => {
            point.applyMatrix4(alignMatrix);
        })

        var newBranches = branchData.splice(2); // take only new scaled branches
        newBranches.forEach((nb) => {
            nb.forEach((point) => {
                point.applyMatrix4(alignMatrix);
            })
        });
        result.push([branch, newBase, ...newBranches]);
    })
    return result;
}


// TODO don't change branches coordinates
// for every branch should be created full set of scaled branches

// returns: [ [branch (previous), newBase scaled, b1 scaled, b2 scaled, ...] ... ]

// для каждой ветки необходимо расчитать набор всех веток в новом масштабе
// для 1-й ветки на выходе функции будет массив длинной 1
// для 2-х веток, на выходе будет массив длиной 4
// для 3-х веток, на выходе будет массив длиной 9

function scaleBranches(base, branches) {

    var newBranchesWithBases = [];

    branches.forEach((branch) => {
        var newBrancheWithBase = [];
        var scaleVal = branch[0].distanceTo(branch[1]) / base[0].distanceTo(base[1]);
        console.log('scaleVal: ' + scaleVal);
        const scaleVector = new THREE.Vector3(scaleVal, scaleVal, scaleVal);
        const m = new THREE.Matrix4();
        m.scale(scaleVector);
        var newBase = cloneAr(base);
        newBase.forEach((point) => {
            point.applyMatrix4(m);
        })
        
        newBrancheWithBase.push(branch);
        newBrancheWithBase.push(newBase);

        branches.forEach((b) => {
            var nb = cloneAr(b);
            nb.forEach((point) => {
                point.applyMatrix4(m);
            })
            
            newBrancheWithBase.push(nb);
            newBranchesWithBases.push(newBrancheWithBase);
        });

        

    });
    return newBranchesWithBases;
}

function cloneAr(ar) {
    if(Array.isArray(ar)) {
        return ar.map(el => cloneAr(el));
    }
    return ar.clone();
}

function drawTrPerp(triangle) {
    var trStartPoint = triangle[0];
    var v1 = triangle[1].clone().sub(trStartPoint);
    var v2 = triangle[2].clone().sub(trStartPoint);

    const perpendicularVector = new THREE.Vector3();
    const perp = perpendicularVector.crossVectors(v1, v2).normalize();

    console.log('perp: ' + JSON.stringify(perp));
    drawLine([trStartPoint, perp.clone().add(trStartPoint)], 'blue');

    return perp; // из начала координат
}

function getTrPerp(triangle) {
    var trStartPoint = triangle[0];
    var v1 = triangle[1].clone().sub(trStartPoint);
    var v2 = triangle[2].clone().sub(trStartPoint);

    const perpendicularVector = new THREE.Vector3();
    const perp = perpendicularVector.crossVectors(v1, v2).normalize();

    return perp; // из начала координат
}

function drawLine(points, color) {
    points = [points[0], points[1]];
    var lg = new THREE.BufferGeometry().setFromPoints(points);
    const lm = new THREE.LineBasicMaterial({ color: color });
    var line = new THREE.Line(lg, lm);
    scene.add(line);
}
