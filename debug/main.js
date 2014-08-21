// TODO init 3d view...
var _mut3dVis = null;
_mut3dVis = new Mutation3dVis("default3dView", {appOptions: {j2sPath: "../lib/jsmol/j2s"}});
_mut3dVis.init();


// Set up Mutation View
$(document).ready(function() {
	$("body").append(window["backbone-template"]["mutationViews"]);

	function processInput(input)
	{
		//var sampleArray = PortalGlobals.getCases().trim().split(/\s+/);
		var parser = new MutationInputParser();

		// parse the provided input string
		var mutationData = parser.parseInput(input);

		var sampleArray = parser.getSampleArray();

		var geneList = parser.getGeneList();

		// No data to visualize...
		if (geneList.length == 0)
		{
			$("#mutation_details").html(
				"No data to visualize. Please make sure your input format is valid.");

			return;
		}

		// customized table options
		var tableOpts = {
			columnVisibility: {
				startPos: function (util, gene) {
					if (util.containsStartPos(gene)) {
						return "visible";
					}
					else {
						return "hidden";
					}
				},
				endPos: function (util, gene) {
					if (util.containsEndPos(gene)) {
						return "visible";
					}
					else {
						return "hidden";
					}
				},
				variantAllele: function (util, gene) {
					if (util.containsVarAllele(gene)) {
						return "visible";
					}
					else {
						return "hidden";
					}
				},
				referenceAllele: function (util, gene) {
					if (util.containsRefAllele(gene)) {
						return "visible";
					}
					else {
						return "hidden";
					}
				},
				chr: function (util, gene) {
					if (util.containsChr(gene)) {
						return "visible";
					}
					else {
						return "hidden";
					}
				}
			},
			columnRender: {
				caseId: function(datum) {
					var mutation = datum.mutation;
					var caseIdFormat = MutationDetailsTableFormatter.getCaseId(mutation.caseId);
					var vars = {};
					vars.linkToPatientView = mutation.linkToPatientView;
					vars.caseId = caseIdFormat.text;
					vars.caseIdClass = caseIdFormat.style;
					vars.caseIdTip = caseIdFormat.tip;

					if (mutation.linkToPatientView)
					{
						return _.template(
							$("#mutation_table_case_id_template").html(), vars);
					}
					else
					{
						return _.template(
							$("#custom_mutation_case_id_template").html(), vars);
					}
				}
			}
		};

		// customized main mapper options
		var options = {
			el: "#mutation_details",
			data: {
				geneList: geneList,
				sampleList: sampleArray
			},
			proxy: {
				mutation: {
					lazy: false,
					data: mutationData
				},
				pfam: {
					lazy: false,
					data: TestData.getPfamData()
				},
				pdb: {
					lazy: false,
					data: TestData.getPdbData()
				}
			},
			view: {
				mutationTable: tableOpts
			}
		};

		// init mutation mapper
		var mutationMapper = new MutationMapper(options);
		mutationMapper.init(_mut3dVis);
	}

	processInput($("#mutation_file_example").val());
});
