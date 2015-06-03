define(
        "chartx/layout/force/physics/barnes-hut",
        [
            "chartx/layout/force/physics/atoms" 
        ],
        function( Atoms ){
            //
            //  barnes-hut.js
            //
            //  implementation of the barnes-hut quadtree algorithm for n-body repulsion
            //  http://www.cs.princeton.edu/courses/archive/fall03/cs126/assignments/barnes-hut.html
            //
            //  Created by Christian Swinehart on 2011-01-14.
            //  Copyright (c) 2011 Samizdat Drafting Co. All rights reserved.
            //

            var BarnesHutTree = function(){

                if(!Atoms && self.Atoms){
                    Atoms = self.Atoms;
                }


                var _branches = [];
                var _branchCtr = 0;
                var _root = null;
                var _theta = .5;

                var that = {
                    init:function(topleft, bottomright, theta){

                        _theta = theta;
                        _branchCtr = 0;
                        _root = that._newBranch();
                        _root.origin = topleft;
                        _root.size = bottomright.subtract(topleft);
                    },

                    insert:function(newParticle){
                        var node = _root;
                        var queue = [newParticle];

                        while (queue.length){
                            var particle = queue.shift();
                            var p_mass = particle._m || particle.m;
                            var p_quad = that._whichQuad(particle, node);

                            if (node[p_quad]===undefined){
                                node[p_quad] = particle;
                                node.mass += p_mass;
                                if (node.p){
                                    node.p = node.p.add(particle.p.multiply(p_mass))
                                }else{
                                    node.p = particle.p.multiply(p_mass)
                                }

                            }else if ('origin' in node[p_quad]){
                                node.mass += (p_mass);
                                if (node.p) { 
                                    node.p = node.p.add(particle.p.multiply(p_mass))
                                } else {
                                    node.p = particle.p.multiply(p_mass)
                                }

                                node = node[p_quad];
                                queue.unshift(particle);
                            }else{
                                var branch_size = node.size.divide(2);
                                var branch_origin = new Atoms.Point(node.origin);
                                if (p_quad[0]=='s'){
                                    branch_origin.y += branch_size.y
                                }
                                if (p_quad[1]=='e') {
                                    branch_origin.x += branch_size.x
                                }

                                var oldParticle = node[p_quad];
                                node[p_quad] = that._newBranch();
                                node[p_quad].origin = branch_origin;
                                node[p_quad].size = branch_size;
                                node.mass = p_mass;
                                node.p = particle.p.multiply(p_mass);
                                node = node[p_quad];

                                if (oldParticle.p.x===particle.p.x && oldParticle.p.y===particle.p.y){
                                    // prevent infinite bisection in the case where two particles
                                    // have identical coordinates by jostling one of them slightly
                                    var x_spread = branch_size.x*.08;
                                    var y_spread = branch_size.y*.08;
                                    oldParticle.p.x = Math.min(
                                            branch_origin.x+branch_size.x,  
                                            Math.max(
                                                branch_origin.x,  
                                                oldParticle.p.x - x_spread/2 + Math.random()*x_spread
                                                )
                                            );
                                    oldParticle.p.y = Math.min(
                                            branch_origin.y+branch_size.y,  
                                            Math.max(branch_origin.y,  
                                                oldParticle.p.y - y_spread/2 + Math.random()*y_spread
                                                )
                                            );
                                }

                                queue.push(oldParticle);
                                queue.unshift(particle);
                            }

                        }

                    },

                    applyForces:function(particle, repulsion){
                        var queue = [_root];
                        while (queue.length){
                            node = queue.shift();
                            if (node===undefined || particle===node){
                                continue
                            }

                            if ('f' in node){
                                var d = particle.p.subtract(node.p);
                                var distance = Math.max(1.0, d.magnitude());
                                var direction = ((d.magnitude()>0) ? d : Atoms.Point.random(1)).normalize()
                                    particle.applyForce(direction.multiply(repulsion*(node._m||node.m))
                                            .divide(distance * distance) );
                            }else{
                                var dist = particle.p.subtract(node.p.divide(node.mass)).magnitude();
                                var size = Math.sqrt(node.size.x * node.size.y);
                                if (size/dist > _theta){ // i.e., s/d > Θ
                                    // open the quad and recurse
                                    queue.push(node.ne);
                                    queue.push(node.nw);
                                    queue.push(node.se);
                                    queue.push(node.sw);
                                }else{
                                    // treat the quad as a single body
                                    var d = particle.p.subtract(node.p.divide(node.mass));
                                    var distance = Math.max(1.0, d.magnitude());
                                    var direction = ((d.magnitude()>0) ? d : Atoms.Point.random(1)).normalize()
                                        particle.applyForce(direction.multiply(repulsion*(node.mass))
                                                .divide(distance * distance) );
                                }
                            }
                        }
                    },

                    _whichQuad:function(particle, node){
                        // sort the particle into one of the quadrants of this node
                        if (particle.p.exploded()) return null
                            var particle_p = particle.p.subtract(node.origin);
                        var halfsize = node.size.divide(2);
                        if (particle_p.y < halfsize.y){
                            if (particle_p.x < halfsize.x) return 'nw'
                            else return 'ne'
                        }else{
                            if (particle_p.x < halfsize.x) return 'sw'
                            else return 'se'
                        }
                    },

                    _newBranch:function(){
                        // to prevent a gc horrorshow, recycle the tree nodes between iterations
                        if (_branches[_branchCtr]){
                            var branch = _branches[_branchCtr];
                            branch.ne = branch.nw = branch.se = branch.sw = undefined;
                            branch.mass = 0;
                            delete branch.p;
                        }else{
                            branch = {origin:null, size:null, 
                                nw:undefined, ne:undefined, sw:undefined, se:undefined, mass:0}
                            _branches[_branchCtr] = branch
                        }

                        _branchCtr++;
                        return branch
                    }
                }

                return that
            }

            self.BarnesHutTree = BarnesHutTree;
            return BarnesHutTree;

        }
);
