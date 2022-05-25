const fs = require('fs'), Jimp = require('jimp'), svgo = require('svgo');

const charCols = 20;
const charRows = 5;
const charWidth = 20;
const charHeight = 30;
const chars = ["space", "!", "quote", "#", "$", "%", "&", "'", "(", ")", "asterisk", "+", ",", "-", ".", "slash", "0", "1", "2", "3",
		"4", "5", "6", "7", "8", "9", "colon", ";", "lt", "=", "gt", "question_mark", "@", "a_upper", "b_upper", "c_upper", "d_upper", "e_upper", "f_upper", "g_upper",
		"h_upper", "i_upper", "j_upper", "k_upper", "l_upper", "m_upper", "n_upper", "o_upper", "p_upper", "q_upper", "r_upper", "s_upper", "t_upper", "u_upper", "v_upper", "w_upper", "x_upper", "y_upper", "z_upper", "paren_open",
		"backslash", "paren_close", "^", "_", "`", "a_lower", "b_lower", "c_lower", "d_lower", "e_lower", "f_lower", "g_lower", "h_lower", "i_lower", "j_lower", "k_lower", "l_lower", "m_lower", "n_lower", "o_lower", 
		"p_lower", "q_lower", "r_lower", "s_lower", "t_lower", "u_lower", "v_lower", "w_lower", "x_lower", "y_lower", "z_lower", "{", "vbar", "}", "~"];

fs.rmSync('svg', { recursive : true, force: true });
fs.mkdirSync('svg');

// convert PNG glyphs into SVG documents
Jimp.read('combined.png')
	.then(combined => {
		let col = 0;
		let row = 0;

		for (i in chars) {
			const svg_path = `svg/${chars[i]}.svg`;
			console.log('processing "' + chars[i] + '"');

			let svg = ""
			svg += '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'
			svg += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n'
			svg += `<svg width="${charWidth}" height="${charHeight}" xmlns="http://www.w3.org/2000/svg">\n`
			
			combined.scan(col * charWidth, row * charHeight, charWidth, charHeight, function(x, y, idx) {
				var red = this.bitmap.data[idx + 0];
				var green = this.bitmap.data[idx + 1];
				var blue = this.bitmap.data[idx + 2];
				var alpha = this.bitmap.data[idx + 3];
				
				if (alpha == 0) {
					return;
				} else {
					svg += `<rect x="${x - col * charWidth}" y="${y - row * charHeight}" width="1" height="1" style="fill:rgba(${red}, ${green}, ${blue}, ${alpha})"/>\n`
				}
			});
			
			svg += '</svg>'
			
			// we have generated a travesty of an SVG document
			// hide our shame by optimizing it
			const result = svgo.optimize(svg, { path: svg_path });
			svg = result.data;
			
			fs.writeFile(svg_path, svg, (err) => {
				if (err) throw err;
			});
			
			col++;
			if (col >= charCols) {
				col = 0;
				row++;
			}
		}
	})
	.catch(err => {
		console.log(err);
	});


